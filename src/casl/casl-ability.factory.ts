import {
  PureAbility,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Tag } from '../tag/entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { Action } from './action.enum';

type Subjects = InferSubjects<typeof Tag | typeof User> | 'all';

export type AppAbility = PureAbility<[Action, Subjects], MatchConditions>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<
      PureAbility<[Action, Subjects], MatchConditions>
    >(PureAbility as AbilityClass<AppAbility>);

    const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

    can(
      [Action.Update, Action.Delete],
      Tag,
      ({ creator }) => creator.uid === user.uid,
    );

    return build({
      conditionsMatcher: lambdaMatcher,
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
