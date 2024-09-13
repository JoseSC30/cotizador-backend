import {
  Controller,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Res,
  Get,
} from '@nestjs/common';
import { CreateBuyPaypalDto } from './dto';
import { BuyMembershipService } from './buy-membership.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('BuyMembership')
@Controller('buy-membership')
export class BuyMembershipController {
  constructor(private readonly buyMembershipService: BuyMembershipService) {}

  @Get('prueba')
  @Auth()
  async prueba(@GetUser('id') authUserId: string) {
    await this.buyMembershipService.updateStock(authUserId);
    return {
      message: 'funciona',
    };
  }

  @Post('paid/create-paypal-order')
  @Auth()
  async createPaypalOrder(
    @Body() cart: CreateBuyPaypalDto,
    @Res() response: Response,
  ) {
    try {
      const { jsonResponse, httpStatusCode } =
        await this.buyMembershipService.createOrder(cart);
      response.status(httpStatusCode);
      return response.json({
        data: jsonResponse,
      });
    } catch (error) {
      console.error('Failed to create order:', error);
      throw new HttpException(
        'Failed to create order.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('paid/orders-paypal/:orderID/capture')
  @Auth()
  async paypalCaptureOrder(
    @Param('orderID') orderID: string,
    @GetUser('id') authUserId: string,
    @Res() response: Response,
  ) {
    try {
      const { jsonResponse, httpStatusCode } =
        await this.buyMembershipService.captureOrder(orderID);

      await this.buyMembershipService.updateStock(authUserId);

      // Aquí asignamos el estado HTTP directamente sin llamarlo como una función más allá de esto
      response.status(httpStatusCode);
      return response.json({
        data: jsonResponse,
      });
    } catch (error) {
      console.error('Failed to create order:', error);
      // Aquí es donde podrías personalizar el mensaje y código de error basado en el error capturado
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to capture order.',
      });
    }
  }
}
