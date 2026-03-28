-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "activity_logs" (
    "activity_logsid" SERIAL NOT NULL,
    "activity" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "userid" INTEGER,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("activity_logsid")
);

-- CreateTable
CREATE TABLE "channel_members" (
    "id" SERIAL NOT NULL,
    "channelid" INTEGER,
    "userid" INTEGER,
    "joined_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "channel_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "channelid" SERIAL NOT NULL,
    "workspaceid" INTEGER,
    "name" TEXT NOT NULL,
    "is_private" BOOLEAN DEFAULT false,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "icon" TEXT,
    "sectionid" INTEGER,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("channelid")
);

-- CreateTable
CREATE TABLE "direct_messages" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER,
    "receiver_id" INTEGER,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "direct_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "fileid" SERIAL NOT NULL,
    "messageid" INTEGER,
    "file_url" TEXT,
    "file_type" TEXT,
    "uploaded_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "files_pkey" PRIMARY KEY ("fileid")
);

-- CreateTable
CREATE TABLE "logins" (
    "loginid" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(6),
    "userid" INTEGER,

    CONSTRAINT "logins_pkey" PRIMARY KEY ("loginid")
);


-- CreateTable
CREATE TABLE "messages" (
    "messageid" SERIAL NOT NULL,
    "channelid" INTEGER,
    "userid" INTEGER,
    "message" TEXT,
    "status" TEXT DEFAULT 'SENT',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("messageid")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notificationid" SERIAL NOT NULL,
    "userid" INTEGER,
    "message" TEXT,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notificationid")
);

-- CreateTable
CREATE TABLE "reactions" (
    "reactionid" SERIAL NOT NULL,
    "messageid" INTEGER,
    "userid" INTEGER,
    "emoji" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("reactionid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT,
    "last_name" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "date_birth" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" SERIAL NOT NULL,
    "workspaceid" INTEGER,
    "userid" INTEGER,
    "role" TEXT DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspaces" (
    "workspaceid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_by" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "img" TEXT,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("workspaceid")
);
 
-- CreateTable
CREATE TABLE "channel_sections" (
    "sectionid" SERIAL NOT NULL,
    "workspaceid" INTEGER,
    "name" TEXT NOT NULL,
    "position" INTEGER DEFAULT 0,

    CONSTRAINT "channel_sections_pkey" PRIMARY KEY ("sectionid")
);

-- CreateIndex
CREATE UNIQUE INDEX "logins_username_key" ON "logins"("username");

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_channelid_fkey" FOREIGN KEY ("channelid") REFERENCES "channels"("channelid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_sectionid_fkey" FOREIGN KEY ("sectionid") REFERENCES "channel_sections"("sectionid") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_workspaceid_fkey" FOREIGN KEY ("workspaceid") REFERENCES "workspaces"("workspaceid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "direct_messages" ADD CONSTRAINT "fk_receiver" FOREIGN KEY ("receiver_id") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "direct_messages" ADD CONSTRAINT "fk_sender" FOREIGN KEY ("sender_id") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_messageid_fkey" FOREIGN KEY ("messageid") REFERENCES "messages"("messageid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "logins" ADD CONSTRAINT "logins_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_channelid_fkey" FOREIGN KEY ("channelid") REFERENCES "channels"("channelid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_messageid_fkey" FOREIGN KEY ("messageid") REFERENCES "messages"("messageid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceid_fkey" FOREIGN KEY ("workspaceid") REFERENCES "workspaces"("workspaceid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("userid") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel_sections" ADD CONSTRAINT "channel_sections_workspaceid_fkey" FOREIGN KEY ("workspaceid") REFERENCES "workspaces"("workspaceid") ON DELETE CASCADE ON UPDATE NO ACTION;

 