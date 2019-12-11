import React from "react";
import * as components from "./manifest";

const comps = { ...components };
const snew = (Component) => (props) =>
  Component ? <Component {...{ ...comps, ...props }} /> : null;
export const AccountActivityBox = (comps.AccountActivityBox = snew(
  comps.AccountActivityBox
));
export const CommentArea = (comps.CommentArea = snew(comps.CommentArea));
export const CommentForm = (comps.CommentForm = snew(comps.CommentForm));
export const Content = (comps.Content = snew(comps.Content));
export const Expando = (comps.Expando = snew(comps.Expando));
export const Header = (comps.Header = snew(comps.Header));
export const HeaderBottomLeft = (comps.HeaderBottomLeft = snew(
  comps.HeaderBottomLeft
));
export const Link = (comps.Link = snew(comps.Link));
export const LoadingIcon = (comps.LoadingIcon = snew(comps.LoadingIcon));
export const LoginForm = (comps.LoginForm = snew(comps.LoginForm));
export const LoginFormSide = (comps.LoginFormSide = snew(comps.LoginFormSide));
export const LoginSignupPage = (comps.LoginSignupPage = snew(
  comps.LoginSignupPage
));
export const Markdown = (comps.Markdown = snew(comps.Markdown));
export const NavButtons = (comps.NavButtons = snew(comps.NavButtons));
export const NestedListing = (comps.NestedListing = snew(comps.NestedListing));
export const OrganicListing = (comps.OrganicListing = snew(
  comps.OrganicListing
));
export const PageLoadingIcon = (comps.LoadingIcon = snew(
  comps.PageLoadingIcon
));
export const RecentlyViewedLinks = (comps.RecentlyViewedLinks = snew(
  comps.RecentlyViewedLinks
));
export const RegisterForm = (comps.RegisterForm = snew(comps.RegisterForm));
export const Sidebar = (comps.Sidebar = snew(comps.Sidebar));
export const SidebarAd = (comps.SidebarAd = snew(comps.SidebarAd));
export const SidebarSearch = (comps.SidebarSearch = snew(comps.SidebarSearch));
export const SidebarTitlebox = (comps.SidebarTitlebox = snew(
  comps.SidebarTitlebox
));
export const SiteTable = (comps.SiteTable = snew(comps.SiteTable));
export const SrHeaderArea = (comps.SrHeaderArea = snew(comps.SrHeaderArea));
export const SubmitLinkSidebox = (comps.SubmitLinkSidebox = snew(
  comps.SubmitLinkSidebox
));
export const SubmitPage = (comps.SubmitPage = snew(comps.SubmitPage));
export const SubmitTextSidebox = (comps.SubmitTextSidebox = snew(
  comps.SubmitTextSidebox
));
export const Subreddit = (comps.Subreddit = snew(comps.Subreddit));
export const Thing = (comps.Thing = snew(comps.Thing));
export const ThingComment = (comps.ThingComment = snew(comps.ThingComment));
export const ThingLink = (comps.ThingLink = snew(comps.ThingLink));
export const UserInfo = (comps.UserInfo = snew(comps.UserInfo));
