import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/packages/schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(data: Omit<User, 'refreshTokenHash'>) {
    return await this.userModel.create(data);
  }

  async getUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async delete(email: string) {
    return await this.userModel.deleteOne({ email });
  }

  async update(email: string, data: Partial<User>) {
    return await this.userModel
      .findOneAndUpdate({ email }, { $set: data }, { new: true })
      .exec();
  }
}
