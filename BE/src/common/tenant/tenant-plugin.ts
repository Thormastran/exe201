import { Schema, Types } from 'mongoose';
import { getTenantId } from './tenant-context';

const QUERY_HOOKS = [
  'find',
  'findOne',
  'findOneAndUpdate',
  'countDocuments',
  'updateMany',
  'deleteMany',
] as const;

/** Tự filter tenantId khi có TenantContext */
export function applyTenantPlugin(schema: Schema) {
  const addTenantFilter = function (this: { where: (f: object) => void }) {
    const tid = getTenantId();
    if (tid) {
      this.where({ tenantId: new Types.ObjectId(tid) });
    }
  };

  for (const hook of QUERY_HOOKS) {
    schema.pre(hook, addTenantFilter);
  }

  schema.pre('save', function () {
    const tid = getTenantId();
    if (tid && !this.get('tenantId')) {
      this.set('tenantId', new Types.ObjectId(tid));
    }
  });
}
