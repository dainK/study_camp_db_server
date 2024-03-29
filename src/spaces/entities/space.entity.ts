import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  // OneToOne, 사용하지 않는거라면 삭제 요망 사용할 예정이라면 임시 주석처리
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
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

  @ManyToOne(() => User, (user) => user.space)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column({ type: 'int', nullable: false })
  user_id: number;

  @ManyToOne(() => SpaceClass, (spaceClass) => spaceClass.space)
  @JoinColumn({ name: 'class_id' })
  space_class: SpaceClass;
  @Column({ type: 'int', name: 'class_id' })
  class_id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  image_url: string;

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

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at?: Date;
}
