import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '../common/enums/role.enum';
import { UsersService } from '../modules/users/users.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const tenantId = process.env.DEFAULT_TENANT_ID;
    const email = this.configService.get<string>('SEED_ADMIN_EMAIL');
    const password = this.configService.get<string>('SEED_ADMIN_PASSWORD');
    const fullName = this.configService.get<string>('SEED_ADMIN_NAME');

    if (email && password && fullName) {
      await this.usersService.seedAdmin(email, password, fullName, tenantId);
      this.logger.log('Đã kiểm tra / tạo tài khoản admin mặc định');
    }

    const staffEmail = this.configService.get<string>('SEED_STAFF_EMAIL');
    const staffPassword = this.configService.get<string>('SEED_STAFF_PASSWORD');
    const staffName = this.configService.get<string>('SEED_STAFF_NAME');

    if (staffEmail && staffPassword && staffName) {
      await this.usersService.seedUserIfNotExists(
        staffEmail,
        staffPassword,
        staffName,
        Role.STAFF,
        { phone: '0901234567', tenantId, username: 'staff' },
      );
      this.logger.log('Đã kiểm tra / tạo tài khoản staff mặc định');
    }

    const kitchenEmail = this.configService.get<string>('SEED_KITCHEN_EMAIL');
    const kitchenPassword = this.configService.get<string>('SEED_KITCHEN_PASSWORD');
    const kitchenName = this.configService.get<string>('SEED_KITCHEN_NAME');

    if (kitchenEmail && kitchenPassword && kitchenName) {
      await this.usersService.seedUserIfNotExists(
        kitchenEmail,
        kitchenPassword,
        kitchenName,
        Role.KITCHEN,
        { tenantId, username: 'kitchen' },
      );
      this.logger.log('Đã kiểm tra / tạo tài khoản bếp mặc định');
    }

    const warehouseEmail = this.configService.get<string>('SEED_WAREHOUSE_EMAIL');
    const warehousePassword = this.configService.get<string>(
      'SEED_WAREHOUSE_PASSWORD',
    );
    const warehouseName = this.configService.get<string>('SEED_WAREHOUSE_NAME');

    if (warehouseEmail && warehousePassword && warehouseName) {
      await this.usersService.seedUserIfNotExists(
        warehouseEmail,
        warehousePassword,
        warehouseName,
        Role.WAREHOUSE,
        { tenantId, username: 'warehouse' },
      );
      this.logger.log('Đã kiểm tra / tạo tài khoản kho mặc định');
    }

    const accountingEmail = this.configService.get<string>(
      'SEED_ACCOUNTING_EMAIL',
    );
    const accountingPassword = this.configService.get<string>(
      'SEED_ACCOUNTING_PASSWORD',
    );
    const accountingName = this.configService.get<string>('SEED_ACCOUNTING_NAME');

    if (accountingEmail && accountingPassword && accountingName) {
      await this.usersService.seedUserIfNotExists(
        accountingEmail,
        accountingPassword,
        accountingName,
        Role.ACCOUNTING,
        { tenantId, username: 'accounting' },
      );
      this.logger.log('Đã kiểm tra / tạo tài khoản kế toán mặc định');
    }

    const managerEmail = this.configService.get<string>('SEED_MANAGER_EMAIL');
    const managerPassword = this.configService.get<string>(
      'SEED_MANAGER_PASSWORD',
    );
    const managerName = this.configService.get<string>('SEED_MANAGER_NAME');

    if (managerEmail && managerPassword && managerName) {
      await this.usersService.seedUserIfNotExists(
        managerEmail,
        managerPassword,
        managerName,
        Role.STORE_MANAGER,
        { tenantId, username: 'manager' },
      );
      this.logger.log('Đã kiểm tra / tạo tài khoản quản lý cửa hàng mặc định');
    }

  }
}
