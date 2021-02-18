/*
Optional Types
1) 특정 필드의 데이터를 입력하지 않는 경우 디폴트값이 대입되도록 설정하는 방법.

@Column({ default: 디폴트값 }) // TypeORM : DB에는 언제나 해당 디폴트값이 포함되어 전달됨.
@IsOptional() // GraphQL DTO Validation상 선택사항. Mutation 사용시, 인자로 해당 필드 누락 가능하도록 설정.
isVegan?: boolean; // TS 측면에서 선택사항 지정.

===================================================================
2) @Field의 옵션에 따라 GraphQL dto에 디폴트 값 대입 여부 설정 가능. 
   - nullable : GraphQL 스키마에서 생략 가능 옵션.
   - defaultValue : GraphQL 스키마에 특정 디폴트값 자동 대입 옵션.

@Field(() => Boolean, { defaultValue: '디폴트값' }) 
- @Field의 defaultValue 옵션은 자동으로 dto에 디폴트값이 담기게 됨.
  => GraphQL resolver에서 인자로 받는 createRestaurantDto에 디폴트 값이 자동 포함됨.

@Field((type) => Boolean, { nullable: true }) 
- @Field의 nullable 옵션이 참이면 해당 필드 값 누락시 dto에도 담기지 않음.
  => GraphQL resolver에서 인자로 받는 createRestaurantDto에 디폴트 값 제외됨.
*/
// ================================================================
// [restaurant.entity.ts] 방법1
@ObjectType()  
@Entity()  
export class Restaurant {
  // ~~~
  @Field(() => Boolean, { defaultValue: 디폴트값 }) // GraphQL 스키마에서의 디폴트값 대입. 
  @Column({ default: 디폴트값 }) // DB에서 해당 필드의 디폴트 값 설정. (typeorm)
  @IsOptional() // DTO Validation상 선택사항. Mutation 사용시, 인자로 해당 필드 누락 가능하도록. 
  @IsBoolean()
  isVegan?: boolean;
  // ~~~
}
// ================================================================
// [restaurant.entity.ts] 방법2
import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';
import { Column, Entity } from 'typeorm';

@ObjectType()  
@Entity()  
export class Restaurant {
  // ~~~
  @Field((type) => Boolean, { defaultValue: true }) // GraphQL 스키마: 해당 필드의 디폴트 값은 true.
  @Column({ default: true }) // DB: 해당 필드의 디폴트 값은 true.
  @IsOptional() // DTO validation: 인자로 해당 필드 누락해도 되도록 설정 => true값 되도록.
  @IsBoolean()
  isVegan?: boolean;
  // ~~~
}
// ================================================================
// http://localhost:3000/graphql
mutation {
  createRestaurant(input:{
    name:"Nicolas2", 
    address:"1234213124", 
    ownerName:"ASDsdfg2",
    categoryName:"asdaf2"
    // isVegan 필드는 입력하지 않아도 true라는 값이 자동대입됨.
  }) 
}
{
  "data": {
    "createRestaurant": true
  }
}
// ================================================================
