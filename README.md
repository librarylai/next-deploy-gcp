## 建立 Dockerfile

```dockerfile
# 可以從 Dockerhub Node 上選擇阪本：https://hub.docker.com/_/node/
FROM node:latest

WORKDIR /app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY . .

# Install production dependencies.
# npm ci 與 npm install 差別在於，ci 是使用 package-lock.json 上的版本，而 install 則是使用 package.json 上的版本來安裝，因此常導致安裝時其他套件的版本被提升上去了。
RUN npm ci --only=production

# Copy local code to the container image.

RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "start" ]
```

## 建立 .dockerignore

`.dockerignore` 主要是用來讓我們 **『篩選掉不需要進入建置階段的檔案』**，也就是等等 `docker build` 時不會把這些檔案都傳送到 Docker Daemon 中，這樣可以加快建置速度。

```dockerfile
README.md
Dockerfile
.dockerignore
node_modules
```

## 建立 Docker image

上面寫好 `Dockerfile` 與 `.dockerignore` 後，就可以開始建置 Docker image 了，指令如下：

> docker build .(Dockerfile 所在路徑) -t (image 名稱):(tag 名稱) --no-cache(不要 cache 避免內容更新時沒有被重新 build 到)

```
 docker build . -t next-deploy:latest --no-cache
```

## 執行 Docker image

我們現在可以透過在 command line 上下達 `docker images` 指令，來查看剛剛建立的 image 是否存在，如下：

![](https://i.imgur.com/edGC5tM.png)

如果有正常看到剛剛 build 出來的 image 的話，那現在就可以來把這個 image 啟起來看一下了，這邊介紹兩種方式來啟動 docker image，一種是透過指令、一種是透過 Docker Desktop。

### 指令啟動 Docker image

> docker run -d(背景執行) -p(對外 port) 3000:3000(等等透過 Web 上網址連進的 port:容器 container port,剛剛 `Dockerfile` 有設定 `EXPOSE 3000`) (image 名稱):(tag 名稱)

```
docker run -d -p 3000:3000 next-deploy:latest
```

啟動完成後可以透過以下指令查看目前全部容器(Containers) 的狀況，可以看到 `STATUS` 的地方代表該容器已經被運行多長時間。

```=
docker ps -a
```

![](https://i.imgur.com/ZilCpXN.png)

#### GUI 啟動 Docker image

> 因為圖片太大導致顯示後會 lag，因此再麻煩想看如何操作的可以點擊下面這個連結～～
> [https://i.imgur.com/zPvEGKP.gif](https://i.imgur.com/zPvEGKP.gif)

## 建立 Google Artifact Registry

Google Artifact Registry 是新一代的 Container Registry。 主要用來儲存、管理及保護 Docker Image，並且可以與 Google Cloud CI/CD 服務結合使用，像是 [ Google Kubernetes Engine (GKE)](https://cloud.google.com/run?hl=zh-tw) 、[Cloud Run](https://cloud.google.com/run?hl=zh-tw)，這邊預計等等會使用 Cloud Run 來做部署，那這邊我們先來『建立一個 Artifact Registry』來存放 Docker Image 吧。

### 安装 gcloud CLI

我們可以透過官網上的[安装 gcloud CLI][https://cloud.google.com/sdk/docs/install?hl=zh-cn#mac] 來在電腦中安裝，方便等等在 command line 上使用 `gcloud` 指令。

#### 1. 下載 gcloud 壓縮檔

> 因為筆者是 Macbook Air M2 晶片，所以選擇的是第二個。

![](https://hackmd.io/_uploads/rJ3d5H762.png)

#### 2. 執行 google-cloud-sdk

下載完並解壓縮後會出現一個 **google-cloud-sdk** 資料夾，之後開啟終端機直接輸入下面指令，接著它就會問你一些問題，基本上可以都選 `Y` 或是按下 `Enter` 就可以了。

**詳細推薦看這篇文章：[M2 Mac 安裝 gcloud CLI - 磐凌科技](https://penueling.com/%E7%B7%9A%E4%B8%8A%E5%AD%B8%E7%BF%92/m2-mac-%E5%AE%89%E8%A3%9D-gcloud-cli/)**

```
./google-cloud-sdk/install.sh
```

![](https://hackmd.io/_uploads/HyeKsrX6h.png)

#### 3.初始化 gcloud

```
gcloud init
```

**重開終端機輸入 `gcloud init` 後它會選項的方是來讓我們選擇要用『哪個帳號』、『哪個專案』...等，那一開始這邊筆者是選擇 `1` 重新初始化**。

![](https://hackmd.io/_uploads/HJqyRHmT2.png)

**接下來選擇帳號的部分，筆者這邊因為要用另一個帳號，所以這邊選擇 `2`，那它會將你跳到 Browser 上叫你登入並驗證權限...等操作。**

![](https://hackmd.io/_uploads/BJx1yIXT3.png)

**最後會叫你選擇要使用哪一個專案 Project，那這邊筆者是直接選擇辦完 Google Cloud Account 後官方預設建立的那個 `My Project`，如果不知道的話可以在 Google Cloud 上找一下，大概會像下圖這樣。**

![](https://hackmd.io/_uploads/r1Lix8Q6n.png)

![](https://hackmd.io/_uploads/ByUJg87Tn.png)

**這個選完後基本上初始化就大功告成了～～～** :fireworks:
