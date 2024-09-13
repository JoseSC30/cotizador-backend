import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateChatAiDto } from './dto/create-chat-ai.dto';
import { UpdateChatAiDto } from './dto/update-chat-ai.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatAi } from './entities/chat-ai.entity';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateDto } from './dto/create.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

interface TrainingResponse {
  message: string;
}

@Injectable()
export class ChatAiService {
  private readonly logger = new Logger('ChatAiService');
  private readonly API_KEY_GPT: string;
  private readonly openai: OpenAI;
  constructor(
    @InjectRepository(ChatAi)
    private readonly chatAiRepository: Repository<ChatAi>,
    private readonly configService: ConfigService,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    this.API_KEY_GPT = this.configService.get('API_KEY_GPT');
    this.openai = new OpenAI({
      apiKey: this.API_KEY_GPT,
    });
  }

  async create(createDto: CreateDto) {
    const chatAi = new ChatAi();
    chatAi.data = createDto.data; // Assign data from DTO; it's okay if it's undefined
    chatAi.images = createDto.images || []; // Assign images, use an empty array if undefined

    await this.chatAiRepository.save(chatAi);
    return chatAi;
  }

  async createPresupuesto(createChatAiDto: CreateChatAiDto) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'From now on he takes the role of architect',
          },
          {
            role: 'user',
            content: `
            ${createChatAiDto.prompt} ,
              devuelvelo como un Json y estructurado como sea necesario,
            te estoy pasando los precios para tomar en cuenta en bolivianos (BOB) y que incluya la mano de obra, ademas que el punto de los precios es decimal y tiene que mostrar el total igual: 

                {
      "accesorios_hidraulicos": [
          {
              "Chicotillo plástico": "Codo de FoGo de 1\/2 pulg",
              "pza": "pza",
              "20.00": "3.70"
          },
          {
              "Chicotillo plástico": "Codo de PVC desague de 1 1\/2 pulg",
              "pza": "pza",
              "20.00": "3.00"
          },
          {
              "Chicotillo plástico": "Cupla de FoGo de 1\/2 pulg",
              "pza": "pza",
              "20.00": "3.00"
          },
          {
              "Chicotillo plástico": "Ducha eléctrica",
              "pza": "pza",
              "20.00": "90.00"
          },
          {
              "Chicotillo plástico": "Ducha sanitaria", 
              "pza": "pza",
              "20.00": "280.00"
          },
          {
              "Chicotillo plástico": "Llave de paso de 1 \"",
              "pza": "pza",
              "20.00": "115.00"
          },
          {
              "Chicotillo plástico": "Llave de paso de 1 1\/2\"",
              "pza": "pza",
              "20.00": "228.00"
          },
          {
              "Chicotillo plástico": "Llave de paso de 1\/2 pulg",
              "pza": "pza",
              "20.00": "48.00"
          },
          {
              "Chicotillo plástico": "Llave de paso de 1\/2 pulg",
              "pza": "pza",
              "20.00": "48.00"
          },
          {
              "Chicotillo plástico": "Llave de paso de 2 \"",
              "pza": "pza",
              "20.00": "315.00"
          },
          {
              "Chicotillo plástico": "Llave de paso de 3\/4 pulg",
              "pza": "pza",
              "20.00": "65.00"
          },
          {
              "Chicotillo plástico": "Niple de Fe de 1\/2 pulg",
              "pza": "pza",
              "20.00": "3.90"
          },
          {
              "Chicotillo plástico": "Reducción de Fe 3\/4x1\/2 pulg",
              "pza": "pza",
              "20.00": "4.00"
          },
          {
              "Chicotillo plástico": "Tee galvanizada 1 1\/2\"",
              "pza": "pza",
              "20.00": "33.00"
          },
          {
              "Chicotillo plástico": "Tee galvanizada 2\"",
              "pza": "pza",
              "20.00": "45.00"
          },
          {
              "Chicotillo plástico": "Teflón 3\/4 pulg",
              "pza": "pza",
              "20.00": "3.00"
          },
          {
              "Chicotillo plástico": "Unión patente de Fe de 1\/2 pulg",
              "pza": "pza",
              "20.00": "14.50"
          },
          {
              "Chicotillo plástico": "Unión patente gavanizada 2\"",
              "pza": "pza",
              "20.00": "75.00"
          },
          {
              "Chicotillo plástico": "Válvula de cortina de 1 1\/2 pulg",
              "pza": "pza",
              "20.00": "228.00"
          }
      ],
      "accesorios_sanitarios": [
          {
              "Pegamento (clefa)": "Pegante para PVC",
              "litros": "litros",
              "35.00": "35.00"
          },
          {
              "Pegamento (clefa)": "Rejilla de bronce 4 pulg",
              "litros": "pieza",
              "35.00": "60.00"
          },
          {
              "Pegamento (clefa)": "Rejilla de piso 20x20",
              "litros": "pieza",
              "35.00": "25.00"
          },
          {
              "Pegamento (clefa)": "Yee de PVC desague de 4 pulg",
              "litros": "pieza",
              "35.00": "10.00"
          }
      ],
      "aceros": [
          {
              "Acero de alta resistencia": "Angular 1\/8 plg. x 1 1\/2 plg. Bar 6.",
              "kg": "barra",
              "8.50": "100.48"
          },
          {
              "Acero de alta resistencia": "Angular 1\/8 plg. x 1 1\/4 plg. Bar 6m.",
              "kg": "barra",
              "8.50": "86.18"
          },
          {
              "Acero de alta resistencia": "Angular 1\/8 plg. x 1 plg. Bar 6m.",
              "kg": "barra",
              "8.50": "67.30"
          },
          {
              "Acero de alta resistencia": "Angular 1\/8 plg. x 3\/4 plg. Bar 6m.",
              "kg": "barra",
              "8.50": "49.28"
          },
          {
              "Acero de alta resistencia": "Angular 3\/16 plg. x 1 1\/2 plg. Bar 6m.",
              "kg": "barra",
              "8.50": "149.89"
          },
          {
              "Acero de alta resistencia": "Angular 3\/16 plg. x 1 plg. Bar 6m.",
              "kg": "barra",
              "8.50": "95.69"
          },
          {
              "Acero de alta resistencia": "Angular 3\/16 plg. x 2 1\/2 plg. Bar 6m.",
              "kg": "barra",
              "8.50": "251.70"
          },
          {
              "Acero de alta resistencia": "Angular 3\/16 plg. x 2 plg. Bar 6m.",
              "kg": "barra",
              "8.50": "181.15"
          },
          {
              "Acero de alta resistencia": "Corrugado 1 plg. (25 mm.) Bar 12m.",
              "kg": "barra",
              "8.50": "400.50"
          },
          {
              "Acero de alta resistencia": "Corrugado 1\/2 plg. (12 mm.) Bar 12m.",
              "kg": "barra",
              "8.50": "89.50"
          },
          {
              "Acero de alta resistencia": "Corrugado 1\/4 plg. (6 mm.) Bar 12m.",
              "kg": "barra",
              "8.50": "22.50"
          },
          {
              "Acero de alta resistencia": "Corrugado 3\/4 plg. (20 mm.) Bar 12m.",
              "kg": "barra",
              "8.50": "254.80"
          },
          {
              "Acero de alta resistencia": "Corrugado 3\/8 plg. (10 mm.) Bar 12m.",
              "kg": "barra",
              "8.50": "61.80"
          },
          {
              "Acero de alta resistencia": "Corrugado 5\/16 plg. (8 mm.) Bar 12m.",
              "kg": "barra",
              "8.50": "39.70"
          },
          {
              "Acero de alta resistencia": "Corrugado 5\/8 plg. (16 mm.) Bar 12m.",
              "kg": "barra",
              "8.50": "158.50"
          },
          {
              "Acero de alta resistencia": "Fierro angular de 3\/4 x 1\/8",
              "kg": "metro_lineal",
              "8.50": "8.30"
          },
          {
              "Acero de alta resistencia": "Fierro redondo de 1\/2",
              "kg": "metro_lineal",
              "8.50": "9.60"
          },
          {
              "Acero de alta resistencia": "Fierro redondo de 3\/4",
              "kg": "metro_lineal",
              "8.50": "41.00"
          }
      ],
      "aglomerantes": [
          {
              "Alquitran": "Cal de blanqueo",
              "kg": "kg",
              "12.60": "0.90"
          },
          {
              "Alquitran": "Cemento blanco",
              "kg": "kg",
              "12.60": "7.00"
          },
          {
              "Alquitran": "Cemento cola",
              "kg": "bolsa",
              "12.60": "25.00"
          },
          {
              "Alquitran": "Cemento cola (para porcelanato)",
              "kg": "kg",
              "12.60": "29.00"
          },
          {
              "Alquitran": "Cemento portland IP-30",
              "kg": "bolsa",
              "12.60": "60.00"
          },
          {
              "Alquitran": "Estuco",
              "kg": "bolsa",
              "12.60": "15.00"
          },
          {
              "Alquitran": "Yeso",
              "kg": "kg",
              "12.60": "0.70"
          },
          {
              "Alquitran": "cemento",
              "kg": "bolsa",
              "12.60": "50.00"
          }
      ],
      "artefactos_sanitarios": [
          {
              "nombre": "Accesorios de baño (jabonero, toallero, papelero, perchero)",
              "unidad": "juego",
              "precio": "196.25"
          },
          {
              "nombre": "Bacha para ducha",
              "unidad": "pieza",
              "precio": "420.00"
          },
          {
              "nombre": "Bañera de hidromasaje D=2.30 con equipo completo",
              "unidad": "pieza",
              "precio": "7,904.00"
          },
          {
              "nombre": "Bañera de hidromasaje de fibra de vidrio 1.60x0.95",
              "unidad": "pieza",
              "precio": "5,635.00"
          },
          {
              "nombre": "Bidet standar blanco",
              "unidad": "pieza",
              "precio": "382.00"
          },
          {
              "nombre": "Bidet standar de color",
              "unidad": "pieza",
              "precio": "420.00"
          },
          {
              "nombre": "Botiquin 1 cuerpo c\/espejo",
              "unidad": "pieza",
              "precio": "131.15"
          },
          {
              "nombre": "Inodoro de tanque alto",
              "unidad": "pieza",
              "precio": "980.00"
          },
          {
              "nombre": "Inodoro de tanque bajo color blanco",
              "unidad": "pieza",
              "precio": "1,700.00"
          },
          {
              "nombre": "Inodoro de tanque bajo de color",
              "unidad": "pieza",
              "precio": "2,000.00"
          },
          {
              "nombre": "Jabonero",
              "unidad": "pieza",
              "precio": "26.14"
          },
          {
              "nombre": "Lavamanos blanco con pedestal",
              "unidad": "pieza",
              "precio": "390.00"
          },
          {
              "nombre": "Lavamanos blanco sin pedestal",
              "unidad": "pieza",
              "precio": "370.00"
          },
          {
              "nombre": "Lavamanos de color con pedestal",
              "unidad": "pieza",
              "precio": "480.00"
          },
          {
              "nombre": "Lavamanos de color para mesón",
              "unidad": "pieza",
              "precio": "400.00"
          },
          {
              "nombre": "Lavamanos de color sin pedestal",
              "unidad": "pieza",
              "precio": "420.00"
          },
          {
              "nombre": "Lavanderia de cemento",
              "unidad": "pieza",
              "precio": "240.00"
          },
          {
              "nombre": "Lavaplatos 1 bacha",
              "unidad": "pieza",
              "precio": "250.00"
          },
          {
              "nombre": "Lavaplatos 2 bachas 1 escurridero",
              "unidad": "pieza",
              "precio": "318.15"
          },
          {
              "nombre": "Lavaplatos 2 bachas 2 escurrideras",
              "unidad": "pieza",
              "precio": "608.00"
          }
      ],
      "aridos": [
          {
              "nombre": "Arena Fina",
              "unidad": "m3",
              "precio": "70.00"
          },
          {
              "nombre": "Arenilla",
              "unidad": "m3",
              "precio": "100.00"
          },
          {
              "nombre": "Piedra bola",
              "unidad": "m3",
              "precio": "192.00"
          },
          {
              "nombre": "Piedra manzana",
              "unidad": "m3",
              "precio": "250.00"
          },
          {
              "nombre": "Piedra pequeña seleccionada 1\"",
              "unidad": "m3",
              "precio": "100.00"
          },
          {
              "nombre": "Ripio bruto",
              "unidad": "m3",
              "precio": "180.00"
          },
          {
              "nombre": "Ripio chancado",
              "unidad": "m3",
              "precio": "230.00"
          },
          {
              "nombre": "Ripio rodado",
              "unidad": "m3",
              "precio": "170.00"
          },
          {
              "nombre": "Tierra de relleno",
              "unidad": "m3",
              "precio": "60.00"
          },
          {
              "nombre": "Tierra negra",
              "unidad": "m3",
              "precio": "140.00"
          }
      ],
      "azulejos": [
          {
              "nombre": "Azulejo blanco de 15x15cm",
              "unidad": "m2",
              "precio": "35.00"
          },
          {
              "nombre": "Azulejo decorado",
              "unidad": "m2",
              "precio": "125.00"
          }
      ],
      "calaminas": [
          {
              "nombre": "Bajante con calamina #28 de 10x15",
              "unidad": "metro_lineal",
              "precio": "100.00"
          },
          {
              "nombre": "Calam. Ond. Plast. Nº 16 1.80x0.80",
              "unidad": "pieza",
              "precio": "111.20"
          },
          {
              "nombre": "Calam. Ond. Plast. Nº 16 2.40x0.80",
              "unidad": "pieza",
              "precio": "142.50"
          },
          {
              "nombre": "Calam. Ond. Plast. Nº12 1.80x0.80",
              "unidad": "pieza",
              "precio": "55.50"
          },
          {
              "nombre": "Calam. Ond. Plast. Nº12 2.40x0.80",
              "unidad": "pieza",
              "precio": "75.50"
          },
          {
              "nombre": "Calam. Ond. Plast. Nº12 3.00x0.80",
              "unidad": "pieza",
              "precio": "98.50"
          },
          {
              "nombre": "Calamina ondulada No28 1.00x2.00",
              "unidad": "pieza",
              "precio": "52.53"
          },
          {
              "nombre": "Calamina Ondulada Nº 28 1.80x0.80",
              "unidad": "pieza",
              "precio": "65.00"
          },
          {
              "nombre": "Calamina Ondulada Nº 28 2.15x0.80",
              "unidad": "pieza",
              "precio": "75.00"
          },
          {
              "nombre": "Calamina Ondulada Nº 28 2.45x0.80",
              "unidad": "pieza",
              "precio": "90.00"
          },
          {
              "nombre": "Calamina Ondulada Nº 28 3x0.80",
              "unidad": "pieza",
              "precio": "105.00"
          },
          {
              "nombre": "Calamina Ondulada Nº 32 0.90x2.15",
              "unidad": "pieza",
              "precio": "42.77"
          },
          {
              "nombre": "Calamina Ondulada Nº 32 1.80x0.90",
              "unidad": "pieza",
              "precio": "36.13"
          },
          {
              "nombre": "Calamina Ondulada Nº 32 2.45x0.90",
              "unidad": "pieza",
              "precio": "48.50"
          },
          {
              "nombre": "Calamina Ondulada Nº 33 1.80x0.70",
              "unidad": "pieza",
              "precio": "28.35"
          },
          {
              "nombre": "Calamina Ondulada Nº 33 1.80x0.80",
              "unidad": "pieza",
              "precio": "29.00"
          },
          {
              "nombre": "Calamina Ondulada Nº 33 2.15x0.80",
              "unidad": "pieza",
              "precio": "33.50"
          },
          {
              "nombre": "Calamina Ondulada Nº 33 2.45x0.80",
              "unidad": "pieza",
              "precio": "38.50"
          },
          {
              "nombre": "Calamina Ondulada Nº 33 3x0.80",
              "unidad": "pieza",
              "precio": "47.00"
          },
          {
              "nombre": "Calamina Plana Nº 26 2x1",
              "unidad": "pieza",
              "precio": "95.00"
          }
      ],
      "cañerias_y_tuberias_pvc": [
          {
              "nombre": "Tubo de PVC de 1 1\/2 pulg",
              "unidad": "metro_lineal",
              "precio": "10.00"
          },
          {
              "nombre": "Tubo de PVC de 1 pulg",
              "unidad": "metro_lineal",
              "precio": "3.60"
          },
          {
              "nombre": "Tubo de PVC de 2 1\/2 pulg",
              "unidad": "metro_lineal",
              "precio": "10.00"
          },
          {
              "nombre": "Tubo de PVC de 2 pulg",
              "unidad": "metro_lineal",
              "precio": "7.80"
          },
          {
              "nombre": "Tubo de PVC de 3 pulg L=4.00",
              "unidad": "pieza",
              "precio": "53.00"
          },
          {
              "nombre": "Tubo de PVC de 4 pulg L=4.00",
              "unidad": "pieza",
              "precio": "76.50"
          },
          {
              "nombre": "Tubo de PVC de 5 pulg L=6.00m",
              "unidad": "pieza",
              "precio": "226.00"
          },
          {
              "nombre": "Tubo de PVC de 6 pulg L=6.00",
              "unidad": "pieza",
              "precio": "324.98"
          }
      ],
      "carpinteria_de_aluminio": [
          {
              "nombre": "Box de baño con aluminio y acrílico",
              "unidad": "m2",
              "precio": "418.00"
          },
          {
              "nombre": "Ventana de aluminio",
              "unidad": "m2",
              "precio": "350.00"
          },
          {
              "nombre": "Ventana de aluminio basculante",
              "unidad": "m2",
              "precio": "364.80"
          }
      ],
      "carpinteria_de_madera": [
          {
              "nombre": "Baranda de madera mara h=0.90",
              "unidad": "metro_lineal",
              "precio": "182.40"
          },
          {
              "nombre": "Divisiones y cajonería de vestidor en melamínico",
              "unidad": "m2",
              "precio": "240.00"
          },
          {
              "nombre": "Escalera de madera",
              "unidad": "pieza",
              "precio": "8,000.00"
          },
          {
              "nombre": "Escalera marinera de acero inoxidable 3 m",
              "unidad": "pieza",
              "precio": "850.00"
          },
          {
              "nombre": "Marco de 2x2 pulg",
              "unidad": "metro_lineal",
              "precio": "21.20"
          },
          {
              "nombre": "Marco de 2x4 mara",
              "unidad": "metro_lineal",
              "precio": "42.56"
          },
          {
              "nombre": "Marco de 2x4 tajibo",
              "unidad": "metro_lineal",
              "precio": "30.88"
          },
          {
              "nombre": "Marco de 2x6 pulg",
              "unidad": "metro_lineal",
              "precio": "65.00"
          },
          {
              "nombre": "Mueble bajo mesón",
              "unidad": "metro_lineal",
              "precio": "684.25"
          },
          {
              "nombre": "Mueble de estanteria para cocina",
              "unidad": "m2",
              "precio": "684.25"
          },
          {
              "nombre": "Peldaño de madera tajibo de 2x12pulg",
              "unidad": "metro_lineal",
              "precio": "53.50"
          },
          {
              "nombre": "Peldaño de madera tajibo de 3x12pulg",
              "unidad": "metro_lineal",
              "precio": "72.96"
          },
          {
              "nombre": "Portón de madera",
              "unidad": "m2",
              "precio": "573.05"
          },
          {
              "nombre": "Puerta con vitral",
              "unidad": "m2",
              "precio": "231.04"
          },
          {
              "nombre": "Puerta placa de 2 pulg 70 cm (interiores)",
              "unidad": "pieza",
              "precio": "840.00"
          },
          {
              "nombre": "Puerta placa de 2 pulg 80 cm (interiores)",
              "unidad": "pieza",
              "precio": "900.00"
          },
          {
              "nombre": "Puerta placa de 2 pulg 90 cm",
              "unidad": "pieza",
              "precio": "940.00"
          },
          {
              "nombre": "Puerta plegable de melamínico para ropero empotrado",
              "unidad": "m2",
              "precio": "322.00"
          },
          {
              "nombre": "Puerta tablero de 2 pulg",
              "unidad": "m2",
              "precio": "600.00"
          },
          {
              "nombre": "Puerta tablero de 2 pulg (Ingreso)",
              "unidad": "pieza",
              "precio": "1,400.00"
          }
      ],
      "ceramicos": [
          {
              "nombre": "Celosía cerámica",
              "unidad": "pieza",
              "precio": "1.80"
          },
          {
              "nombre": "Cerámica picada",
              "unidad": "m2",
              "precio": "7.30"
          },
          {
              "nombre": "Cerámica roja 7x15",
              "unidad": "m2",
              "precio": "35.00"
          },
          {
              "nombre": "Ladrillo adobito",
              "unidad": "pza",
              "precio": "0.65"
          },
          {
              "nombre": "Ladrillo Ceramico de 21 H esp visto",
              "unidad": "pieza",
              "precio": "1.31"
          },
          {
              "nombre": "Ladrillo Ceramico de 6 H tabique",
              "unidad": "pieza",
              "precio": "1.20"
          },
          {
              "nombre": "Ladrillo gambote",
              "unidad": "pieza",
              "precio": "1.16"
          },
          {
              "nombre": "Ladrillo refractario",
              "unidad": "m2",
              "precio": "120.00"
          },
          {
              "nombre": "Pieza de celosía ceramica",
              "unidad": "pieza",
              "precio": "1.20"
          },
          {
              "nombre": "Revestimiento cerámica esmaltada",
              "unidad": "m2",
              "precio": "65.00"
          },
          {
              "nombre": "Teja colonial",
              "unidad": "pieza",
              "precio": "2.30"
          }
      ],
      "cerrajeria": [
          {
              "nombre": "Baranda de tubo metálico h=90cm",
              "unidad": "metro_lineal",
              "precio": "354.20"
          },
          {
              "nombre": "Churrasquera",
              "unidad": "pza",
              "precio": "949.90"
          },
          {
              "nombre": "Electródo AWS 6013",
              "unidad": "Kg",
              "precio": "23.00"
          },
          {
              "nombre": "Escalera caracol metálica con peldaños de madera H=2.6 R=0.8",
              "unidad": "pieza",
              "precio": "2,067.20"
          },
          {
              "nombre": "Parrilla para churrasquera",
              "unidad": "pieza",
              "precio": "949.90"
          },
          {
              "nombre": "Puerta metalica arrollable",
              "unidad": "m2",
              "precio": "420.00"
          },
          {
              "nombre": "Reja de protección de fierro",
              "unidad": "m2",
              "precio": "402.50"
          },
          {
              "nombre": "Reja de protección de fierro angular",
              "unidad": "m2",
              "precio": "380.00"
          },
          {
              "nombre": "Tinglado metálico",
              "unidad": "m2",
              "precio": "350.00"
          },
          {
              "nombre": "Verja metálica de tubo cuadrado",
              "unidad": "m2",
              "precio": "420.00"
          }
      ],
      "cielo_falso": [
          {
              "nombre": "Cielo falso de yeso aprensado",
              "unidad": "m2",
              "precio": "150.00"
          },
          {
              "nombre": "Cielo falso de plastoform con perfiles de aluminio",
              "unidad": "m2",
              "precio": "175.00"
          }
      ],
      "clavos": [
          {
              "nombre": "Tornillos",
              "unidad": "pieza",
              "precio": "1.50"
          },
          {
              "nombre": "Tirafondo de 2 1\/2\"x1\/4\"",
              "unidad": "pieza",
              "precio": "3.50"
          },
          {
              "nombre": "Ramplus",
              "unidad": "pieza",
              "precio": "5.00"
          },
          {
              "nombre": "Gancho \"J\" de 100 mm",
              "unidad": "pieza",
              "precio": "7.50"
          },
          {
              "nombre": "Clavos de calamina",
              "unidad": "kg",
              "precio": "12.00"
          },
          {
              "nombre": "Clavos de 4 pulg",
              "unidad": "kg",
              "precio": "20.00"
          },
          {
              "nombre": "Clavos de 3 pulg",
              "unidad": "kg",
              "precio": "13.00"
          },
          {
              "nombre": "Clavos de 2 pulg",
              "unidad": "kg",
              "precio": "13.00"
          },
          {
              "nombre": "Clavos de 2 1\/2 pulg",
              "unidad": "kg",
              "precio": "13.00"
          },
          {
              "nombre": "Clavos de 1 1\/2 pulg",
              "unidad": "kg",
              "precio": "13.00"
          }
      ],
      "cubiertas": [
          {
              "nombre": "Policarbonato Transparente de 2.10x5.80x8mm",
              "unidad": "Plancha",
              "precio": "1,439.10"
          },
          {
              "nombre": "Policarbonato Transparente 10mm",
              "unidad": "M2",
              "precio": "137.24"
          },
          {
              "nombre": "Policarbonato tranparente de 8mm",
              "unidad": "M2",
              "precio": "118.15"
          },
          {
              "nombre": "Plancha Policarbonato transparente 2.10x5.80x10mm",
              "unidad": "Plancha",
              "precio": "1,670.76"
          },
          {
              "nombre": "Perfil \"U\" p\/Policarbonato Transparente L= 2.10m",
              "unidad": "metro_lineal",
              "precio": "13.34"
          },
          {
              "nombre": "Perfil \"H\" p\/Policarbonato Transparente L=5.80m",
              "unidad": "metro_lineal",
              "precio": "19.31"
          },
          {
              "nombre": "Paja para plafoneado",
              "unidad": "m2",
              "precio": "3.50"
          },
          {
              "nombre": "Cubierta de Jatata",
              "unidad": "m2",
              "precio": "121.60"
          },
          {
              "nombre": "Cercha de madera de 2x4 pulg",
              "unidad": "metro_lineal",
              "precio": "87.92"
          },
          {
              "nombre": "Calam. Ond. Plast. Nº 16 3.00x0.80",
              "unidad": "pieza",
              "precio": "165.00"
          }
      ],
      "equipamiento": [
          {
              "nombre": "Rejilla metálica para división interior de roperos (prof. 50cm)",
              "unidad": "metro_lineal",
              "precio": "213.00"
          }
      ],
      "fibrocemento": [
          {
              "nombre": "Teja ondulada Duralit 2.44 x 1.08",
              "unidad": "pieza",
              "precio": "105.00"
          },
          {
              "nombre": "Teja FBC",
              "unidad": "m2",
              "precio": "72.00"
          },
          {
              "nombre": "Teja Duralit Española 1.60x1.05",
              "unidad": "pieza",
              "precio": "90.50"
          },
          {
              "nombre": "Teja Duralit Española 0.70x1.05",
              "unidad": "pieza",
              "precio": "50.00"
          },
          {
              "nombre": "Teja Duralit Canalit 1.00x3.50",
              "unidad": "pieza",
              "precio": "212.80"
          },
          {
              "nombre": "Teja cumbrera Duralit Española",
              "unidad": "pieza",
              "precio": "30.00"
          },
          {
              "nombre": "Cumbrera para teja ondulada",
              "unidad": "pieza",
              "precio": "33.44"
          },
          {
              "nombre": "Cumbrera para Residencial 10 Duralit",
              "unidad": "pieza",
              "precio": "30.40"
          },
          {
              "nombre": "Cumbrera Duralit Española",
              "unidad": "pieza",
              "precio": "26.00"
          }
      ],
      "fierros": [
          {
              "nombre": "Tornillo de encarne de 1 1\/2 pulg",
              "unidad": "pieza",
              "precio": "1.22"
          },
          {
              "nombre": "Tirafondo 4 1\/2x1\/4",
              "unidad": "pieza",
              "precio": "2.50"
          },
          {
              "nombre": "Perno de 1\/2x4 pulg",
              "unidad": "pieza",
              "precio": "6.01"
          },
          {
              "nombre": "Guia L",
              "unidad": "pieza",
              "precio": "10.00"
          },
          {
              "nombre": "Cercha metálica",
              "unidad": "m2",
              "precio": "210.00"
          }
      ],
      "griferia": [
          {
              "nombre": "Grifo móvil niquelado",
              "unidad": "pieza",
              "precio": "238.00"
          },
          {
              "nombre": "Grifo de 1\/2 pulg",
              "unidad": "pieza",
              "precio": "90.00"
          },
          {
              "nombre": "Grifo de 1 pulg",
              "unidad": "pieza",
              "precio": "58.81"
          },
          {
              "nombre": "Grifería urinario",
              "unidad": "jgo",
              "precio": "163.86"
          },
          {
              "nombre": "Grifería para tina",
              "unidad": "pieza",
              "precio": "666.50"
          },
          {
              "nombre": "Grifería lavarropa",
              "unidad": "pieza",
              "precio": "52.58"
          },
          {
              "nombre": "Grifería lavaplatos (pico móvil)",
              "unidad": "pieza",
              "precio": "245.00"
          },
          {
              "nombre": "Grifería lavamanos simple",
              "unidad": "pieza",
              "precio": "185.00"
          },
          {
              "nombre": "Grifería lavamanos mezcladora",
              "unidad": "jgo",
              "precio": "264.80"
          },
          {
              "nombre": "Grifería ducha",
              "unidad": "jgo",
              "precio": "312.32"
          }
      ],
      "hormigones": [
          {
              "nombre": "Hormigón premezclado fck=210",
              "unidad": "m3",
              "precio": "830.00"
          }
      ],
      "impermeabilizantes": [
          {
              "nombre": "Silicona p\/vidrio",
              "unidad": "tbo",
              "precio": "17.52"
          },
          {
              "nombre": "Sika-1",
              "unidad": "lt",
              "precio": "18.00"
          },
          {
              "nombre": "Polietileno",
              "unidad": "m2",
              "precio": "3.73"
          },
          {
              "nombre": "Membrana asfáltica",
              "unidad": "m2",
              "precio": "46.97"
          },
          {
              "nombre": "Impermeabilizante Recuplast galon 18 lt",
              "unidad": "gln",
              "precio": "835.13"
          }
      ],
      "instalacion_electrica": [
          {
              "nombre": "Zoquete de colgar común",
              "unidad": "pieza",
              "precio": "3.00"
          },
          {
              "nombre": "Tubo fluorescente 40 W",
              "unidad": "pieza",
              "precio": "65.00"
          },
          {
              "nombre": "Tubo fluorescente 20 W",
              "unidad": "pieza",
              "precio": "91.20"
          },
          {
              "nombre": "Tubo Berman de 5\/8 pulg",
              "unidad": "ml",
              "precio": "2.00"
          },
          {
              "nombre": "Tubo Berman de 3\/4 pulg",
              "unidad": "metro_lineal",
              "precio": "5.00"
          },
          {
              "nombre": "Tubo Berman de 1 pulg",
              "unidad": "metro_lineal",
              "precio": "4.50"
          },
          {
              "nombre": "Toma para sonido",
              "unidad": "pieza",
              "precio": "18.00"
          },
          {
              "nombre": "Toma de telefono de empotrar",
              "unidad": "pieza",
              "precio": "27.00"
          },
          {
              "nombre": "Toma coaxial para tv",
              "unidad": "pieza",
              "precio": "29.00"
          },
          {
              "nombre": "Portero eléctrico de vivienda",
              "unidad": "pieza",
              "precio": "384.00"
          },
          {
              "nombre": "Politubo De 1\/2\"",
              "unidad": "metro_lineal",
              "precio": "2.00"
          },
          {
              "nombre": "Placa tomacorriente simple",
              "unidad": "pieza",
              "precio": "25.00"
          },
          {
              "nombre": "Placa tomacorriente doble para computadora",
              "unidad": "pieza",
              "precio": "36.48"
          },
          {
              "nombre": "Placa tomacorriente doble de piso con tierra",
              "unidad": "pieza",
              "precio": "42.00"
          },
          {
              "nombre": "Placa tomacorriente doble de piso",
              "unidad": "pieza",
              "precio": "35.00"
          },
          {
              "nombre": "Placa tomacorriente doble con tierra",
              "unidad": "pieza",
              "precio": "35.00"
          },
          {
              "nombre": "Placa tomacorriente doble",
              "unidad": "pieza",
              "precio": "29.00"
          },
          {
              "nombre": "Placa de entrega de obra",
              "unidad": "pieza",
              "precio": "324.00"
          },
          {
              "nombre": "Pararrayo radioactivo",
              "unidad": "pieza",
              "precio": "304.00"
          },
          {
              "nombre": "Multipar (para 2 pares)",
              "unidad": "metro_lineal",
              "precio": "2.19"
          }
      ],
      "instalacion_hidraulica": [
          {
              "nombre": "Tubería de FoGo 3 plg",
              "unidad": "metro_lineal",
              "precio": "55.94"
          },
          {
              "nombre": "Tubería de FoGo 2 plg",
              "unidad": "metro_lineal",
              "precio": "55.94"
          },
          {
              "nombre": "Medidor de flujo de agua",
              "unidad": "metro_lineal",
              "precio": "342.00"
          },
          {
              "nombre": "Cañería HIDRO3 de 3\/4 pulg",
              "unidad": "metro_lineal",
              "precio": "10.21"
          },
          {
              "nombre": "Cañería de PVC de 1 1\/2 pulg",
              "unidad": "metro_lineal",
              "precio": "15.00"
          },
          {
              "nombre": "Cañería de P.V.C. de 3\/4 pulg",
              "unidad": "metro_lineal",
              "precio": "7.00"
          },
          {
              "nombre": "Cañería de P.V.C. de 1\/2 pulg",
              "unidad": "metro_lineal",
              "precio": "4.00"
          },
          {
              "nombre": "Cañería de HIDRO3 de 3\/4 pulg",
              "unidad": "metro_lineal",
              "precio": "8.20"
          },
          {
              "nombre": "Cañería de HIDRO3 de 1\/2 pulg",
              "unidad": "metro_lineal",
              "precio": "4.80"
          },
          {
              "nombre": "Cañería de FoGo de 3\/4 pulg L=6.00",
              "unidad": "pieza",
              "precio": "175.00"
          },
          {
              "nombre": "Cañería de FoGo de 3 pulg L=6.00",
              "unidad": "pieza",
              "precio": "690.00"
          },
          {
              "nombre": "Cañería de FoGo de 2 pulg L=6.00",
              "unidad": "pieza",
              "precio": "360.00"
          },
          {
              "nombre": "Cañería de FoGo de 1\/2 pulg L=6.00",
              "unidad": "pieza",
              "precio": "85.00"
          },
          {
              "nombre": "Cañería de FoGo de 1 pulg L=6.00",
              "unidad": "pieza",
              "precio": "245.00"
          },
          {
              "nombre": "Cañería de FoGo de 1 1\/2 pulg L=6.00",
              "unidad": "pieza",
              "precio": "295.00"
          },
          {
              "nombre": "Cañería de aluminio de 1\/2 pulg",
              "unidad": "pieza",
              "precio": "18.00"
          },
          {
              "nombre": "Cañería de agua caliente de 1\/2 pulg",
              "unidad": "metro_lineal",
              "precio": "5.47"
          }
      ],
      "instalacion_sanitaria": [
          {
              "nombre": "Sifón para lavaplato simple",
              "unidad": "pieza",
              "precio": "20.00"
          },
          {
              "nombre": "Sifón para lavaplato doble",
              "unidad": "pieza",
              "precio": "27.50"
          },
          {
              "nombre": "Cámara desgrasadora de P.V.C. 6\"",
              "unidad": "pieza",
              "precio": "24.00"
          },
          {
              "nombre": "Caja sifonada de 6 plg",
              "unidad": "pieza",
              "precio": "54.00"
          },
          {
              "nombre": "Caja sifonada de 4 plg",
              "unidad": "pieza",
              "precio": "25.00"
          },
          {
              "nombre": "Adhesivo para P.V.C.",
              "unidad": "litro",
              "precio": "25.00"
          }
      ],
      "instalacion_telefonica": [
          {
              "nombre": "Cable telefónico de dos pares",
              "unidad": "metro_lineal",
              "precio": "2.20"
          }
      ],
      "maderas": [
          {
              "nombre": "Viga de 3x6 pulg",
              "unidad": "metro_lineal",
              "precio": "100.00"
          },
          {
              "nombre": "Viga de 2x6 pulg",
              "unidad": "metro_lineal",
              "precio": "68.00"
          },
          {
              "nombre": "Viga de 2x4 pulg",
              "unidad": "metro_lineal",
              "precio": "45.00"
          },
          {
              "nombre": "puntales de 3 m.",
              "unidad": "pza",
              "precio": "17.00"
          },
          {
              "nombre": "Puntales",
              "unidad": "Pza",
              "precio": "15.00"
          },
          {
              "nombre": "Puntales",
              "unidad": "Pza",
              "precio": "15.00"
          },
          {
              "nombre": "Puntal rollizo",
              "unidad": "pza",
              "precio": "15.00"
          },
          {
              "nombre": "Madera tajibo",
              "unidad": "pie2",
              "precio": "20.00"
          },
          {
              "nombre": "Madera para encofrado",
              "unidad": "pie3",
              "precio": "8.00"
          },
          {
              "nombre": "Madera para andamio",
              "unidad": "pie4",
              "precio": "10.00"
          },
          {
              "nombre": "Madera ochoo",
              "unidad": "pie5",
              "precio": "10.00"
          },
          {
              "nombre": "Madera de tajibo cepillada",
              "unidad": "pie6",
              "precio": "20.00"
          },
          {
              "nombre": "Madera de construccion",
              "unidad": "pie7",
              "precio": "10.00"
          },
          {
              "nombre": "Madera de 2x5 almendrillo",
              "unidad": "pie8",
              "precio": "20.00"
          },
          {
              "nombre": "Madera de 2x4 pulg",
              "unidad": "pie9",
              "precio": "18.00"
          },
          {
              "nombre": "Madera de 2x4 almendrillo",
              "unidad": "pie10",
              "precio": "20.00"
          },
          {
              "nombre": "Madera cuchi 7x7 4.5m",
              "unidad": "pieza",
              "precio": "875.00"
          },
          {
              "nombre": "Madera cuchi 4x4 plg. 3.0m",
              "unidad": "pieza",
              "precio": "200.00"
          },
          {
              "nombre": "Madera 8x8 tajibo cepillada",
              "unidad": "metro_lineal",
              "precio": "360.00"
          },
          {
              "nombre": "Madera 6x6 tajibo cepillada",
              "unidad": "metro_lineal",
              "precio": "200.00"
          }
      ],
      "mallas_y_alambres": [
          {
              "nombre": "Malla olímpica #16 1\/2\"",
              "unidad": "m2",
              "precio": "74.00"
          },
          {
              "nombre": "Malla olímpica #14 3\/4\"",
              "unidad": "m2",
              "precio": "63.00"
          },
          {
              "nombre": "Malla olímpica #10",
              "unidad": "m2",
              "precio": "60.00"
          },
          {
              "nombre": "Malla milimétrica",
              "unidad": "m2",
              "precio": "2.92"
          },
          {
              "nombre": "Malla gallinera",
              "unidad": "m2",
              "precio": "3.50"
          },
          {
              "nombre": "Alambre Galvanizado # 8",
              "unidad": "kg",
              "precio": "20.00"
          },
          {
              "nombre": "Alambre Galvanizado # 12",
              "unidad": "kg",
              "precio": "20.00"
          },
          {
              "nombre": "Alambre Galvanizado # 10",
              "unidad": "kg",
              "precio": "20.00"
          },
          {
              "nombre": "Alambre de púas",
              "unidad": "metro_lineal",
              "precio": "0.42"
          },
          {
              "nombre": "Alambre de amarre",
              "unidad": "kg",
              "precio": "11.00"
          }
      ],
      "mesones": [
          {
              "nombre": "Meson marmol reconstituido 60cm",
              "unidad": "metro_lineal",
              "precio": "520.00"
          },
          {
              "nombre": "Meson de madera 60cm",
              "unidad": "metro_lineal",
              "precio": "380.00"
          },
          {
              "nombre": "Meson de granito 60cm",
              "unidad": "metro_lineal",
              "precio": "706.50"
          }
      ],
      "muros": [
          {
              "nombre": "Panel 3D (4\\\" 2.44X1.22)",
              "unidad": "pieza",
              "precio": "257.60"
          },
          {
              "nombre": "Enchape corto Incerpaz",
              "unidad": "m2",
              "precio": "71.00"
          },
          {
              "nombre": "bloque de yeso",
              "unidad": "m2",
              "precio": "122.50"
          }
      ],
      "ornamentacion": [
          {
              "nombre": "Plantas ornamentales para jardineras",
              "unidad": "m2",
              "precio": "48.64"
          },
          {
              "nombre": "Grama para jardinera",
              "unidad": "m2",
              "precio": "40.25"
          }
      ],
      "otros": [
          {
              "nombre": "Sika Flex 1A",
              "unidad": "kg",
              "precio": "245.94"
          },
          {
              "nombre": "Materiales para instalación de obrador",
              "unidad": "gbl",
              "precio": "200.00"
          },
          {
              "nombre": "Manguera 1 pulg politubo",
              "unidad": "metro_lineal",
              "precio": "4.32"
          },
          {
              "nombre": "Letrero de obra",
              "unidad": "pza",
              "precio": "250.00"
          },
          {
              "nombre": "Espejo doble",
              "unidad": "m2",
              "precio": "200.00"
          },
          {
              "nombre": "Domus de aluminio y vidrio",
              "unidad": "gbl",
              "precio": "1,824.00"
          },
          {
              "nombre": "Diesel",
              "unidad": "litro",
              "precio": "3.10"
          },
          {
              "nombre": "Agua",
              "unidad": "litro",
              "precio": "60.00"
          },
          {
              "nombre": "Agua",
              "unidad": "litro",
              "precio": "0.06"
          }
      ],
      "panel_3d": [
          {
              "nombre": "Malla de unión y esquinera 1",
              "unidad": "pza",
              "precio": "1.82"
          },
          {
              "nombre": "Malla de refuerzo plana y en U",
              "unidad": "pza",
              "precio": "2.74"
          }
      ],
      "piedras_decorativas": [
          {
              "nombre": "Piedra pirka",
              "unidad": "m2",
              "precio": "80.00"
          },
          {
              "nombre": "Piedra listón",
              "unidad": "m2",
              "precio": "100.00"
          },
          {
              "nombre": "Piedra Laja",
              "unidad": "m2",
              "precio": "90.00"
          }
      ],
      "pinturas": [
          {
              "nombre": "Sellador fijador",
              "unidad": "litro",
              "precio": "18.00"
          },
          {
              "nombre": "Sellador de paredes",
              "unidad": "litro",
              "precio": "19.50"
          },
          {
              "nombre": "Rodillo",
              "unidad": "pieza",
              "precio": "25.00"
          },
          {
              "nombre": "Pintura latex",
              "unidad": "litro",
              "precio": "30.00"
          },
          {
              "nombre": "Pintura latex",
              "unidad": "litro",
              "precio": "30.00"
          },
          {
              "nombre": "Pintura al óleo",
              "unidad": "litro",
              "precio": "39.89"
          },
          {
              "nombre": "Pintura acrílica",
              "unidad": "litro",
              "precio": "39.32"
          },
          {
              "nombre": "Ocre",
              "unidad": "kg",
              "precio": "25.00"
          },
          {
              "nombre": "Masa Corrida",
              "unidad": "litro",
              "precio": "12.00"
          },
          {
              "nombre": "Masa corrida",
              "unidad": "litro",
              "precio": "15.00"
          },
          {
              "nombre": "Lija",
              "unidad": "ml",
              "precio": "7.00"
          },
          {
              "nombre": "Brocha de 4 pulg",
              "unidad": "pieza",
              "precio": "45.00"
          },
          {
              "nombre": "Brocha de 2 pulg",
              "unidad": "pieza",
              "precio": "25.00"
          },
          {
              "nombre": "Barniz filtrosolar",
              "unidad": "litro",
              "precio": "24.00"
          },
          {
              "nombre": "Aguarras",
              "unidad": "litro",
              "precio": "35.50"
          },
          {
              "nombre": "Acuacolor",
              "unidad": "litro",
              "precio": "10.94"
          }
      ],
      "pisos": [
          {
              "nombre": "flexiplast",
              "unidad": "m2",
              "precio": "64.03"
          },
          {
              "nombre": "Piso de porcelanato",
              "unidad": "m2",
              "precio": "140.00"
          },
          {
              "nombre": "Piso de cerámica roja natural",
              "unidad": "m2",
              "precio": "42.00"
          },
          {
              "nombre": "Piso de cerámica gres 15x15cm",
              "unidad": "m2",
              "precio": "56.00"
          },
          {
              "nombre": "Piso de cerámica española",
              "unidad": "m2",
              "precio": "175.00"
          },
          {
              "nombre": "Piso de cerámica esmaltada",
              "unidad": "m2",
              "precio": "45.00"
          },
          {
              "nombre": "Parket para piso",
              "unidad": "m2",
              "precio": "154.00"
          },
          {
              "nombre": "Mosaico granito",
              "unidad": "m2",
              "precio": "98.50"
          },
          {
              "nombre": "Mosaico común",
              "unidad": "m2",
              "precio": "42.00"
          },
          {
              "nombre": "Cerámica nacional 32x32",
              "unidad": "m2",
              "precio": "45.00"
          },
          {
              "nombre": "Ceramica exterior",
              "unidad": "m2",
              "precio": "58.75"
          },
          {
              "nombre": "Ceramica Esmaltada P\/ Piso (40x40cm)",
              "unidad": "m2",
              "precio": "70.00"
          },
          {
              "nombre": "Alfombra de alto tráfico",
              "unidad": "m2",
              "precio": "70.65"
          }
      ],
      "plasticos": [
          {
              "nombre": "Tarugo plástico para tornillo de encarne",
              "unidad": "pza",
              "precio": "0.91"
          },
          {
              "nombre": "Plastoform",
              "unidad": "m3",
              "precio": "255.00"
          },
          {
              "nombre": "Hilo Nylon",
              "unidad": "pza",
              "precio": "14.00"
          },
          {
              "nombre": "Cumbrera Onduline",
              "unidad": "pza",
              "precio": "194.56"
          },
          {
              "nombre": "Calamina Plástica Onduline (200x90)",
              "unidad": "pza",
              "precio": "79.95"
          }
      ],
      "prefabricados": [
          {
              "nombre": "Viguetas y complemento #16",
              "unidad": "m2",
              "precio": "102.00"
          },
          {
              "nombre": "Viguetas y complemento #12",
              "unidad": "m2",
              "precio": "100.00"
          },
          {
              "nombre": "Viguetas y complemento #10",
              "unidad": "m2",
              "precio": "77.00"
          },
          {
              "nombre": "Poste prefabricado de hormigón L=3.00",
              "unidad": "pieza",
              "precio": "75.00"
          },
          {
              "nombre": "Piso de baldosa tipo rejilla de Ho prefabricado",
              "unidad": "m2",
              "precio": "83.00"
          },
          {
              "nombre": "Pilastra prefabricada para medidor monofásico",
              "unidad": "pieza",
              "precio": "400.00"
          },
          {
              "nombre": "Loseta Hexag. 10 cm. (34 pza\/m2)",
              "unidad": "pieza",
              "precio": "2.10"
          },
          {
              "nombre": "Loseta Hex. Concretec (12 pza\/m2)",
              "unidad": "pza",
              "precio": "6.50"
          },
          {
              "nombre": "Loseta de Ho",
              "unidad": "m2",
              "precio": "90.00"
          },
          {
              "nombre": "Cordón de acera",
              "unidad": "pieza",
              "precio": "55.00"
          },
          {
              "nombre": "bloque prefabricado",
              "unidad": "pieza",
              "precio": "5.30"
          },
          {
              "nombre": "Bloque de cemento celosía",
              "unidad": "m2",
              "precio": "36.48"
          }
      ],
      "quincalleria": [
          {
              "nombre": "Rulemanes para ventanas",
              "unidad": "pieza",
              "precio": "4.00"
          },
          {
              "nombre": "Rieles de ventana",
              "unidad": "ml",
              "precio": "6.00"
          },
          {
              "nombre": "Picaporte",
              "unidad": "pieza",
              "precio": "6.00"
          },
          {
              "nombre": "Jaladores",
              "unidad": "pieza",
              "precio": "8.00"
          },
          {
              "nombre": "Chapa para puerta de servicio",
              "unidad": "pieza",
              "precio": "251.20"
          },
          {
              "nombre": "Chapa para interiores",
              "unidad": "pieza",
              "precio": "215.87"
          },
          {
              "nombre": "Chapa para exteriores",
              "unidad": "pieza",
              "precio": "410.75"
          },
          {
              "nombre": "Chapa para baño",
              "unidad": "pieza",
              "precio": "249.07"
          },
          {
              "nombre": "Bisagra de Fe. de 4 pulg",
              "unidad": "pieza",
              "precio": "25.00"
          },
          {
              "nombre": "Bisagra de 4 pulg",
              "unidad": "pieza",
              "precio": "25.00"
          },
          {
              "nombre": "Bisagra de 3 pulg",
              "unidad": "pieza",
              "precio": "12.00"
          }
      ],
      "tubin": [
          {
              "nombre": "Tubín cuadrado 50mm 30mm",
              "unidad": "metro_lineal",
              "precio": "36.00"
          },
          {
              "nombre": "Tubín cuadrado 20mm 20mm",
              "unidad": "metro_lineal",
              "precio": "24.00"
          }
      ],
      "tubos": [
          {
              "nombre": "Tubo de cemento de 8pulg",
              "unidad": "metro_lineal",
              "precio": "100.00"
          }
      ],
      "vdrios": [
          {
              "nombre": "Vidrio templado de 10 mm",
              "unidad": "m2",
              "precio": "500.00"
          },
          {
              "nombre": "Vidrio doble",
              "unidad": "p2",
              "precio": "8.00"
          },
          {
              "nombre": "Vidrio de 4mm",
              "unidad": "m2",
              "precio": "100.63"
          },
          {
              "nombre": "Vidrio catedral",
              "unidad": "pie2",
              "precio": "10.00"
          },
          {
              "nombre": "Vidrio acanalado",
              "unidad": "pie2",
              "precio": "7.56"
          },
          {
              "nombre": "Espejo 8mm",
              "unidad": "m2",
              "precio": "158.08"
          },
          {
              "nombre": "Espejo 3mm",
              "unidad": "m2",
              "precio": "85.12"
          }
      ],
      "mano_de_obra": [
      {
        "descripcion": "Ayudante",
        "unidad": "dia",
        "precio": 100.00
      },
      {
        "descripcion": "Ayudante (carpintero)",
        "unidad": "dia",
        "precio": 100.00
      },
      {
        "descripcion": "Ayudante (cerrajero)",
        "unidad": "hr",
        "precio": 100.00
      },
      {
        "descripcion": "Ayudante (electricista)",
        "unidad": "dia",
        "precio": 100.00
      },
      {
        "descripcion": "Ayudante (encofrador)",
        "unidad": "dia",
        "precio": 100.00
      },
      {
        "descripcion": "Ayudante (fierrista)",
        "unidad": "dia",
        "precio": 100.00
      },
       {
        "descripcion": "Ayudante (pintor)",
        "unidad": "dia",
        "precio": 100.00
      },
      {
        "descripcion": "Ayudante (plomero)",
        "unidad": "dia",
        "precio": 100.00
      },
      {
        "descripcion": "Ayudante 2",
        "unidad": "hr",
        "precio": 12.50
      },
      {
        "descripcion": "Ayudante 6",
        "unidad": "hr",
        "precio": 12.50
      },
      {
        "descripcion": "Ayudante De Albañil",
        "unidad": "hr",
        "precio": 12.50
      },
  {
        "descripcion": "Ayudante de pintor",
        "unidad": "hr",
        "precio": 12.50
      },
      {
        "descripcion": "Capataz",
        "unidad": "dia",
        "precio": 150.00
      },
      {
        "descripcion": "Colocador de alfombras",
        "unidad": "hr",
        "precio": 20.00
      },
      {
        "descripcion": "Colocador de cielo falso",
        "unidad": "hr",
        "precio": 15.00
      },
      {
        "descripcion": "Colocador de Cielo Falso de Yeso Aprenzado",
        "unidad": "hr",
        "precio": 15.00
      },
      {
        "descripcion": "Instalación de tina de hidromasaje",
        "unidad": "gbl",
        "precio": 1.50
      },
      {
        "descripcion": "Maestro albañil",
        "unidad": "hr",
        "precio": 18.75
      },
      {
        "descripcion": "Maestro albañil",
        "unidad": "dia",
        "precio": 150.00
      }
    ]
  }    
            `,
          },
        ],
        model: 'gpt-4-turbo',
      });

      // console.log(completion.choices[0]);
      const chatAi = await this.findOne(createChatAiDto.iDChatAi);
      // Step 2: Update the data field
      chatAi.data = completion.choices[0].message.content;

      // Step 3: Save the updated entity
      await this.chatAiRepository.save(chatAi);
      console.log(completion.choices[0].message.content);
      return completion.choices[0];
    } catch (error) {
      this.logger.error(error);
      return {
        message: 'Ha ocurrido un error, revise los logs',
      };
    }
  }
  async createImage(createChatAiDto: CreateChatAiDto) {
    const chatAi = await this.findOne(createChatAiDto.iDChatAi);

    const url = 'https://api.openai.com/v1/images/generations';
    const data = {
      model: 'dall-e-3',
      prompt: `${createChatAiDto.prompt}`,
      n: 1,
      size: '1024x1024',
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.API_KEY_GPT}`,
      },
    };

    try {
      const response = await axios.post(url, data, config);
      const imageUrls = response.data.data[0].url; // Assume response data structure
      // console.log(response.data.data[0].url);
      // Append the new image URL to the existing array
      const uploaded = await this.uploadImage(imageUrls);
      chatAi.images = [...chatAi.images, uploaded.secureUrl];

      //console.log(uploaded);
      this.logger.log(uploaded);
      // Save the updated entity
      await this.chatAiRepository.save(chatAi);
      return chatAi; // return the updated ChatAi entity
    } catch (error) {
      console.error('Error fetching image:', error);
      throw error;
    }
  }

  async uploadImage(url: string) {
    try {
      const imageBuffer = await this.downloadImage(url);
      const file: Express.Multer.File = {
        buffer: imageBuffer,
        // Necesitarás estos campos aunque no los uses
        fieldname: '',
        originalname: '',
        encoding: '',
        mimetype: 'image/jpeg', // Puedes ajustar el tipo MIME según el tipo de la imagen
        size: imageBuffer.length,
        stream: null,
        destination: '',
        filename: '',
        path: '',
      };
      const uploadResult = await this.cloudinaryService.uploadFileImageAi(file);
      return uploadResult;
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  async downloadImage(url: string): Promise<Buffer> {
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
      });

      return Buffer.from(response.data);
    } catch (error) {
      throw new HttpException(
        'Failed to download image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(term: number) {
    return await this.chatAiRepository.findOneOrFail({
      where: {
        id: term,
      },
    });
  }

  async update(id: number, updateChatAiDto: UpdateChatAiDto) {
    try {
    } catch (error) {
      // Aquí puedes manejar errores específicos o re-lanzar errores generales
      if (
        error.status === HttpStatus.NOT_FOUND ||
        error.status === HttpStatus.FORBIDDEN
      ) {
        throw error; // Re-lanza el error si es un error de negocio ya manejado
      } else {
        // Maneja cualquier otro tipo de error no esperado
        console.error('An unexpected error occurred', error);
        throw new HttpException(
          'An unexpected error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
