import {
  DetailsRoute,
  EditProposalRoute,
  HomeRoute,
  NewProposalRoute,
  RawProposalRoute,
  UserRoutes,
} from "../pages";

export const routes = [
  HomeRoute,
  NewProposalRoute,
  DetailsRoute,
  EditProposalRoute,
  ...UserRoutes,
  { ...DetailsRoute, path: "/record/:token/comment/:commentid" },
  RawProposalRoute,
];
