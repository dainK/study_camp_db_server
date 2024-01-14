import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { SpaceMember } from 'src/space-members/entities/space-member.entity';
import { SpaceClass } from './space-class.entity';
import { Group } from 'src/group/entities/group.entity';
import { Lecture } from 'src/lectures/entities/lecture.entity';
import { Alarm } from 'src/alarms/entities/alarm.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('spaces')
export class Space {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.space)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', nullable: false })
  user_id: number;

  @OneToOne(() => SpaceClass, (spaceClass) => spaceClass.space)
  @JoinColumn({ name: 'class_id' })
  space_class: SpaceClass;
  @Column({ type: 'int', name: 'class_id' })
  class_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => SpaceMember, (spaceMember) => spaceMember.space, {
    onDelete: 'CASCADE',
  })
  spaceMembers: SpaceMember[];

  @OneToMany(() => Group, (group) => group.space, { onDelete: 'CASCADE' })
  groups: Group[];

  @OneToMany(() => Lecture, (lecture) => lecture.space, { onDelete: 'CASCADE' })
  lectures: Lecture[];

  @OneToMany(() => Alarm, (alarm) => alarm.space, { onDelete: 'CASCADE' })
  alarms: Alarm[];
}
