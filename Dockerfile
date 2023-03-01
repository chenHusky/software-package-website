FROM gplane/pnpm as Builder

RUN mkdir -p /home/software-package/web
WORKDIR /home/software-package/web
COPY . /home/software-package/web

RUN pnpm install

RUN pnpm build

FROM nginx:1.20.0

COPY --from=Builder /home/software-package/web/dist /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/nginx/nginx.conf /etc/nginx/nginx.conf


ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]
