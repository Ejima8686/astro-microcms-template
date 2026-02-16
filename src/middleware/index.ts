import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  context.locals.setTypes = (pageType: PageType, postType: PostType) => {
    context.locals.pageType = pageType;
    context.locals.postType = postType;
  };

  return next();
});
