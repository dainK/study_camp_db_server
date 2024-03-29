import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AddGroupMember } from './dto/add-group-member.dto';
import { GroupMembersService } from './group-members.service';
import { DeleteGroupMember } from './dto/delete-group-member.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@UseGuards(AuthGuard('jwt'), JwtAuthGuard)
@Controller('group-members')
export class GroupMembersController {
  constructor(private groupMembersService: GroupMembersService) {}

  // 서비스로 위로 올려보내줄 것
  // 멤버 만들기
  // 그럼애도 일단 컨트롤러에 넣고 생각할 것.

  @Post()
  @UsePipes(ValidationPipe)
  async addGroupMember(@Body() addGroupMember: AddGroupMember) {
    return await this.groupMembersService.addGroupMember(
      addGroupMember.groupId,
      addGroupMember.memberId,
    );
  }

  @Delete()
  // @UsePipes(ValidationPipe)
  async deleteGroupMember(@Body() deleteGroupMember: DeleteGroupMember) {
    console.log('===>', deleteGroupMember);
    return await this.groupMembersService.deleteGroupMember(
      deleteGroupMember.groupId,
      deleteGroupMember.memberId,
    );
  }

  @Get('/:spaceId')
  async getGroupUsers(@Param('spaceId') spaceId: string, @Request() req) {
    return await this.groupMembersService.getGroupUsers(+spaceId, req.user.id);
  }
}
