import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateBuyMembershipDto } from './dto/create-buy-membership.dto';
import { BuyMembership } from './entities/buy-membership.entity';
import { User } from '../auth/entities/user.entity';
import { CurrencyService } from '../currency/currency.service';
import { ChatStockService } from '../chat-stock/chat-stock.service';
import { DataSource } from 'typeorm';
import fetch from 'node-fetch';

@Injectable()
export class BuyMembershipService {
  private readonly logger = new Logger('BuyMembershipService');

  private readonly PAYPAL_CLIENT_ID =
    this.configService.get('PAYPAL_CLIENT_ID');

  private readonly PAYPAL_CLIENT_SECRET = this.configService.get(
    'PAYPAL_CLIENT_SECRET',
  );

  private readonly BASE = this.configService.get('PAYPAL_URL');

  constructor(
    private readonly currencyService: CurrencyService,
    private readonly dataSource: DataSource,
    private readonly chatStockService: ChatStockService,
    private readonly configService: ConfigService,
  ) {}

  async updateStock(authUserId: string) {
    const buyMembershipDto = {
      price: 5,
      benefits: ['Benefit 1', 'Benefit 2'],
      planName: 'Premium Plan Plus',
      description: 'This is a premium membership plan.',
      chatsNumber: 8,
    };

    await this.create(buyMembershipDto, authUserId);
  }

  async create(
    createBuyMembershipDto: CreateBuyMembershipDto,
    authUserId: string,
  ) {
    // De momento esto debe meterse en la base de datos de manera estatica de tal forma
    //que se encuentre una moneda con ese ID
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.getCustomUser(authUserId);

      const currency = await this.currencyService.findOne(1);

      const buyMembership = new BuyMembership();

      buyMembership.date = createBuyMembershipDto.date;
      buyMembership.planName = createBuyMembershipDto.planName;
      buyMembership.description = createBuyMembershipDto.description;
      buyMembership.price = createBuyMembershipDto.price;
      buyMembership.benefits = createBuyMembershipDto.benefits;
      buyMembership.currency = currency;
      buyMembership.membership = user.membership;
      buyMembership.chatsNumber = createBuyMembershipDto.chatsNumber;

      await this.dataSource.manager.save(buyMembership);

      await this.chatStockService.update(
        user.membership.chatStock.id,
        {
          chatsNumber: createBuyMembershipDto.chatsNumber,
          occupied: 0,
        },
        true,
      );
      await queryRunner.commitTransaction();

      return {
        message: `Successful Purchase!`,
      };
    } catch (error) {
      this.handleDBErrors(error);
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }

  private async getCustomUser(userId: string) {
    const user = await this.dataSource.getRepository(User).findOneOrFail({
      relations: {
        membership: {
          chatStock: true,
        },
      },
      where: { id: userId },
    });
    return user;
  }

  async createOrder(cart: Cart) {
    // use the cart information passed from the front-end to calculate the purchase unit details
    console.log(
      'shopping cart information passed from the frontend createOrder() callback:',
      cart,
    );

    const accessToken = await this.generateAccessToken();
    const url = `${this.BASE}/v2/checkout/orders`;
    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: cart.amount,
          },
        },
      ],
    };

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return this.handleResponse(response);
  }

  async captureOrder(orderID: string) {
    const accessToken = await this.generateAccessToken();
    const url = `${this.BASE}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
        // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
        // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
    });

    return this.handleResponse(response);
  }

  async generateAccessToken() {
    try {
      if (!this.PAYPAL_CLIENT_ID || !this.PAYPAL_CLIENT_SECRET) {
        throw new Error('MISSING_API_CREDENTIALS');
      }
      const auth = Buffer.from(
        this.PAYPAL_CLIENT_ID + ':' + this.PAYPAL_CLIENT_SECRET,
      ).toString('base64');
      const response = await fetch(`${this.BASE}/v1/oauth2/token`, {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });

      const data = await response.json();
      //console.log(data);
      return data.access_token;
    } catch (error) {
      console.error('Failed to generate Access Token:', error);
    }
  }

  async handleResponse(response: any) {
    try {
      const jsonResponse = await response.json();
      return {
        jsonResponse,
        httpStatusCode: response.status,
      };
    } catch (err) {
      const errorMessage = await response.text();
      throw new Error(errorMessage);
    }
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
