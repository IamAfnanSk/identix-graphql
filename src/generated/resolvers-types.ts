import { GraphQLResolveInfo } from 'graphql';
import { CustomApolloContext } from '../index';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Mutation = {
  __typename?: 'Mutation';
  createLink: StatusDataErrorString;
  deleteLink: StatusDataErrorString;
  deleteUser: StatusDataErrorString;
  logout: StatusDataErrorString;
  refreshAuthToken: StatusDataErrorString;
  register: StatusDataErrorString;
  requestPasswordReset: StatusDataErrorString;
  resetPassword: StatusDataErrorString;
  updateLink: StatusDataErrorString;
};


export type MutationCreateLinkArgs = {
  details: UserLinkCreateInput;
};


export type MutationDeleteLinkArgs = {
  linkId: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  details: UserRegisterInput;
};


export type MutationRequestPasswordResetArgs = {
  details: UserRequestPasswordResetInput;
};


export type MutationResetPasswordArgs = {
  details: UserResetPasswordInput;
};


export type MutationUpdateLinkArgs = {
  details: UserLinkUpdateInput;
  linkId: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  getUserLink: StatusDataErrorUserLink;
  getUserLinks: StatusDataErrorUserLinks;
  login: StatusDataErrorString;
};


export type QueryGetUserLinkArgs = {
  linkId: Scalars['String']['input'];
};


export type QueryLoginArgs = {
  details: UserLoginInput;
};

export enum ReturnStatus {
  Error = 'ERROR',
  Success = 'SUCCESS'
}

export type StatusDataErrorString = {
  __typename?: 'StatusDataErrorString';
  data?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  status: ReturnStatus;
};

export type StatusDataErrorUserLink = {
  __typename?: 'StatusDataErrorUserLink';
  data?: Maybe<UserLink>;
  error?: Maybe<Scalars['String']['output']>;
  status: ReturnStatus;
};

export type StatusDataErrorUserLinks = {
  __typename?: 'StatusDataErrorUserLinks';
  data?: Maybe<Array<UserLink>>;
  error?: Maybe<Scalars['String']['output']>;
  status: ReturnStatus;
};

export type UserLink = {
  __typename?: 'UserLink';
  createdAt: Scalars['Int']['output'];
  email: Scalars['String']['output'];
  facebookURL?: Maybe<Scalars['String']['output']>;
  firstName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  instagramURL?: Maybe<Scalars['String']['output']>;
  lastName: Scalars['String']['output'];
  linkedInURL?: Maybe<Scalars['String']['output']>;
  phoneURL?: Maybe<Scalars['String']['output']>;
  twitterURL?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['Int']['output'];
  userId: Scalars['String']['output'];
  websiteURL?: Maybe<Scalars['String']['output']>;
};

export type UserLinkCreateInput = {
  email: Scalars['String']['input'];
  facebookURL?: InputMaybe<Scalars['String']['input']>;
  firstName: Scalars['String']['input'];
  instagramURL?: InputMaybe<Scalars['String']['input']>;
  lastName: Scalars['String']['input'];
  linkedInURL?: InputMaybe<Scalars['String']['input']>;
  phoneURL?: InputMaybe<Scalars['String']['input']>;
  twitterURL?: InputMaybe<Scalars['String']['input']>;
  websiteURL?: InputMaybe<Scalars['String']['input']>;
};

export type UserLinkUpdateInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  facebookURL?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  instagramURL?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  linkedInURL?: InputMaybe<Scalars['String']['input']>;
  phoneURL?: InputMaybe<Scalars['String']['input']>;
  twitterURL?: InputMaybe<Scalars['String']['input']>;
  websiteURL?: InputMaybe<Scalars['String']['input']>;
};

export type UserLoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UserRegisterInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UserRequestPasswordResetInput = {
  email: Scalars['String']['input'];
};

export type UserResetPasswordInput = {
  password: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  ReturnStatus: ReturnStatus;
  StatusDataErrorString: ResolverTypeWrapper<StatusDataErrorString>;
  StatusDataErrorUserLink: ResolverTypeWrapper<StatusDataErrorUserLink>;
  StatusDataErrorUserLinks: ResolverTypeWrapper<StatusDataErrorUserLinks>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UserLink: ResolverTypeWrapper<UserLink>;
  UserLinkCreateInput: UserLinkCreateInput;
  UserLinkUpdateInput: UserLinkUpdateInput;
  UserLoginInput: UserLoginInput;
  UserRegisterInput: UserRegisterInput;
  UserRequestPasswordResetInput: UserRequestPasswordResetInput;
  UserResetPasswordInput: UserResetPasswordInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  StatusDataErrorString: StatusDataErrorString;
  StatusDataErrorUserLink: StatusDataErrorUserLink;
  StatusDataErrorUserLinks: StatusDataErrorUserLinks;
  String: Scalars['String']['output'];
  UserLink: UserLink;
  UserLinkCreateInput: UserLinkCreateInput;
  UserLinkUpdateInput: UserLinkUpdateInput;
  UserLoginInput: UserLoginInput;
  UserRegisterInput: UserRegisterInput;
  UserRequestPasswordResetInput: UserRequestPasswordResetInput;
  UserResetPasswordInput: UserResetPasswordInput;
}>;

export type MutationResolvers<ContextType = CustomApolloContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createLink?: Resolver<ResolversTypes['StatusDataErrorString'], ParentType, ContextType, RequireFields<MutationCreateLinkArgs, 'details'>>;
  deleteLink?: Resolver<ResolversTypes['StatusDataErrorString'], ParentType, ContextType, RequireFields<MutationDeleteLinkArgs, 'linkId'>>;
  deleteUser?: Resolver<ResolversTypes['StatusDataErrorString'], ParentType, ContextType>;
  logout?: Resolver<ResolversTypes['StatusDataErrorString'], ParentType, ContextType>;
  refreshAuthToken?: Resolver<ResolversTypes['StatusDataErrorString'], ParentType, ContextType>;
  register?: Resolver<ResolversTypes['StatusDataErrorString'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'details'>>;
  requestPasswordReset?: Resolver<ResolversTypes['StatusDataErrorString'], ParentType, ContextType, RequireFields<MutationRequestPasswordResetArgs, 'details'>>;
  resetPassword?: Resolver<ResolversTypes['StatusDataErrorString'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'details'>>;
  updateLink?: Resolver<ResolversTypes['StatusDataErrorString'], ParentType, ContextType, RequireFields<MutationUpdateLinkArgs, 'details' | 'linkId'>>;
}>;

export type QueryResolvers<ContextType = CustomApolloContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getUserLink?: Resolver<ResolversTypes['StatusDataErrorUserLink'], ParentType, ContextType, RequireFields<QueryGetUserLinkArgs, 'linkId'>>;
  getUserLinks?: Resolver<ResolversTypes['StatusDataErrorUserLinks'], ParentType, ContextType>;
  login?: Resolver<ResolversTypes['StatusDataErrorString'], ParentType, ContextType, RequireFields<QueryLoginArgs, 'details'>>;
}>;

export type StatusDataErrorStringResolvers<ContextType = CustomApolloContext, ParentType extends ResolversParentTypes['StatusDataErrorString'] = ResolversParentTypes['StatusDataErrorString']> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ReturnStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatusDataErrorUserLinkResolvers<ContextType = CustomApolloContext, ParentType extends ResolversParentTypes['StatusDataErrorUserLink'] = ResolversParentTypes['StatusDataErrorUserLink']> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['UserLink']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ReturnStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type StatusDataErrorUserLinksResolvers<ContextType = CustomApolloContext, ParentType extends ResolversParentTypes['StatusDataErrorUserLinks'] = ResolversParentTypes['StatusDataErrorUserLinks']> = ResolversObject<{
  data?: Resolver<Maybe<Array<ResolversTypes['UserLink']>>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ReturnStatus'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserLinkResolvers<ContextType = CustomApolloContext, ParentType extends ResolversParentTypes['UserLink'] = ResolversParentTypes['UserLink']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  facebookURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instagramURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  linkedInURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  twitterURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  websiteURL?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = CustomApolloContext> = ResolversObject<{
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  StatusDataErrorString?: StatusDataErrorStringResolvers<ContextType>;
  StatusDataErrorUserLink?: StatusDataErrorUserLinkResolvers<ContextType>;
  StatusDataErrorUserLinks?: StatusDataErrorUserLinksResolvers<ContextType>;
  UserLink?: UserLinkResolvers<ContextType>;
}>;

