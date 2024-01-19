import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from './entities/space.entity';
import { SpaceMembersModule } from 'src/space-members/space-members.module';
import { SpaceMembersService } from 'src/space-members/space-members.service';
import { SpaceMemberRole } from 'src/space-members/types/space-member-role.type';
@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space) private spacesRepository: Repository<Space>,
    private spaceMemberService: SpaceMembersService,
  ) {}

  //구글 로그인 이후 socket연결하면 검증된 유저다.
  //login local(test)+ google(main)

  //Public영역
  //추상화된 어떤 큰게 있는데 그게 유저랑 스페이스 관리한다.
  //서비스는 막 만들자. S규칙 지키면서
  //컨트롤러는 결국 URL요청 받기 위해 쓰는 것.
  //보안 결제한 유저냐 진짜 있는 유저냐 강제로 개발자 도구 열어서 보내는건 막아야지
  //코드를 더 짜봐야 안다. 지금 이 시점에서 확실하게 말해줄 수 없다.
  //일단 짜고 나서 생각해라. 
  async createSpace(createSpaceDto: CreateSpaceDto) {
    try {
      let exSpace: Space = await this.findSpaceByName(createSpaceDto.name);
      this.IsSpaceExisting(exSpace);
      //이 부분도 고민해보자 이렇게 길어질 필요가 없는데
      //유저가 실제로 존재하는지 클래스가 실제로 존재하는지를 여기서 검증해야 하나?
      let newSpace = this.spacesRepository.create({
        name: createSpaceDto.name,
        user_id: createSpaceDto.userId,
        class_id: createSpaceDto.classId,
      });
      //오류처리 어떻게 하냐 서버 멈추는데
      //왜 유저 1 클래스 1 유저 2 클래스 2는 되는데 유저 1 클래스 2 유저 2 클래스 1은 안되냐
      //이건 고민 많이 해봐야 겠는데
      // 일단 있는지 부터 좀 찾아볼래?
      newSpace = await this.spacesRepository.save(newSpace);
      let exUser = this.spaceMemberService.createSpaceMember(SpaceMemberRole.Admin);
      //여기도 생각 많이 해보자. 코드 리팩토링 필요하다.
      exUser.user_id = newSpace.user_id;
      exUser.space_id = newSpace.id;
      await this.spaceMemberService.saveSpaceMember(exUser);
      return { code: 201, message: 'You succesfully make a space' };
    } catch (error) {
      //고쳐아 함.
      if(error.errno == 1452){
        throw new ConflictException("서버 에러 발생")
      }
      throw error;
    }
  }
  //삭제하고자 하는 유저가 방을 만든 장본인인지 확인해야 한다.
  //어떻게 확인할 것인가? 가드? 데코레이터? 이건 말을 해봐야 알 수 있다.
  async deleteSpace(name: string) {
    try {
      //TODO: 방을 만든 장본인인지 확인하는 로직이 필요하다.
      // 누구한테 물어봐야 하나? 권한은 가드고 정보는 데코레이터 jwt쓰면 정보 줄거고
      let exSpace = await this.findSpaceByName(name);
      if(!exSpace){
        throw new NotFoundException('해당하는 방은 존재하지 않습니다.')
      }
      await this.spacesRepository.delete(exSpace);
      return { code: 200, message: 'You successfully delete the space' };
    } catch (error) {
      throw error;
    }
  }

  //이건 단일로 써도 되는건가?
  async findSpacesByUser(user: any) {
    let results = await this.spacesRepository.findBy({ user_id: user.id });
    return results;
  }


  //Private영역
  //#DB func
  private async findSpaceByName(name: string): Promise<Space> {
    try {
      let result = await this.spacesRepository.findOneBy({ name: name });
      return result;
    } catch (error) {
      throw new ConflictException('서버 에러');
    }
  }

  //#checker
  private IsSpaceExisting(space: Space) {
    if (space) {
      throw new BadRequestException('해당하는 방이 이미 존재합니다.');
    }
  }
}
