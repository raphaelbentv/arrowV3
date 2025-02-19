import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type IntervenantDocument = Intervenant & Document;

@Schema()
export class Intervenant {
  @Prop({ required: true })
  nom: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  specialite: string;
}

export const IntervenantSchema = SchemaFactory.createForClass(Intervenant);
