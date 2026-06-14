import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { applyTenantPlugin } from '../../../common/tenant/tenant-plugin';
import { ReturnClosureStatus } from '../../../common/enums/return-closure-status.enum';
import { StockRequestStatus } from '../../../common/enums/stock-request-status.enum';
import { StockRequestType } from '../../../common/enums/stock-request-type.enum';

export type StockTransferRequestDocument = StockTransferRequest & Document;

@Schema({ _id: false })
export class StockRequestLine {
  @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
  ingredientId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  quantity: number;

  /** Đã hoàn trả (chỉ trên phiếu cấp phát) */
  @Prop({ default: 0, min: 0 })
  returnedQuantity?: number;
}

export const StockRequestLineSchema =
  SchemaFactory.createForClass(StockRequestLine);

@Schema({ timestamps: true, collection: 'stock_transfer_requests' })
export class StockTransferRequest {
  @Prop({ type: Types.ObjectId, ref: 'Tenant', index: true })
  tenantId?: Types.ObjectId;

  @Prop({ required: true, trim: true })
  requestNumber: string;

  @Prop({ required: true, enum: StockRequestType })
  type: StockRequestType;

  @Prop({ required: true, enum: StockRequestStatus, default: StockRequestStatus.DRAFT })
  status: StockRequestStatus;

  @Prop({ type: Types.ObjectId, ref: 'WarehouseLocation', required: true })
  fromWarehouseId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  fromWarehouseCode: string;

  @Prop({ required: true, trim: true })
  fromWarehouseName: string;

  @Prop({ type: Types.ObjectId, ref: 'WarehouseLocation', required: true })
  toWarehouseId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  toWarehouseCode: string;

  @Prop({ required: true, trim: true })
  toWarehouseName: string;

  /** Số chứng từ xin phép (bắt buộc khi gửi duyệt) */
  @Prop({ trim: true })
  permitDocumentNumber?: string;

  @Prop()
  permitDocumentDate?: Date;

  @Prop({ trim: true })
  purpose?: string;

  @Prop({ trim: true })
  note?: string;

  @Prop({ type: [StockRequestLineSchema], default: [] })
  lines: StockRequestLine[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  requestedBy?: Types.ObjectId;

  @Prop()
  requestedByName?: string;

  @Prop()
  submittedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewedByName?: string;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  accountingNote?: string;

  @Prop()
  rejectReason?: string;

  @Prop()
  completedAt?: Date;

  /** Ngày nghiệp vụ (ca làm / ngày cấp phát) — YYYY-MM-DD */
  @Prop({ trim: true })
  businessDate?: string;

  /** Phiếu cấp phát gốc (bắt buộc với hoàn trả) */
  @Prop({ type: Types.ObjectId, ref: 'StockTransferRequest' })
  parentRequestId?: Types.ObjectId;

  @Prop({ trim: true })
  parentRequestNumber?: string;

  @Prop({
    enum: ReturnClosureStatus,
    default: ReturnClosureStatus.NOT_APPLICABLE,
  })
  returnClosureStatus: ReturnClosureStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const StockTransferRequestSchema =
  SchemaFactory.createForClass(StockTransferRequest);

StockTransferRequestSchema.index({ tenantId: 1, requestNumber: 1 }, { unique: true });
applyTenantPlugin(StockTransferRequestSchema);

StockTransferRequestSchema.set('toJSON', {
  transform: (_doc, ret) => ({
    id: ret._id?.toString(),
    requestNumber: ret.requestNumber,
    type: ret.type,
    status: ret.status,
    fromWarehouseId: ret.fromWarehouseId?.toString(),
    fromWarehouseCode: ret.fromWarehouseCode,
    fromWarehouseName: ret.fromWarehouseName,
    toWarehouseId: ret.toWarehouseId?.toString(),
    toWarehouseCode: ret.toWarehouseCode,
    toWarehouseName: ret.toWarehouseName,
    permitDocumentNumber: ret.permitDocumentNumber,
    permitDocumentDate: ret.permitDocumentDate,
    purpose: ret.purpose,
    note: ret.note,
    businessDate: ret.businessDate,
    parentRequestId: ret.parentRequestId?.toString(),
    parentRequestNumber: ret.parentRequestNumber,
    returnClosureStatus: ret.returnClosureStatus,
    lines: ret.lines?.map(
      (l: StockRequestLine & { ingredientId?: { toString(): string } }) => ({
        ingredientId: l.ingredientId?.toString?.() ?? l.ingredientId,
        quantity: l.quantity,
        returnedQuantity: l.returnedQuantity ?? 0,
      }),
    ),
    requestedByName: ret.requestedByName,
    submittedAt: ret.submittedAt,
    reviewedByName: ret.reviewedByName,
    reviewedAt: ret.reviewedAt,
    accountingNote: ret.accountingNote,
    rejectReason: ret.rejectReason,
    completedAt: ret.completedAt,
    createdAt: ret.createdAt,
    updatedAt: ret.updatedAt,
  }),
});
