--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: conversationparticipants; Type: TABLE; Schema: public; Owner: senpai
--

CREATE TABLE public.conversationparticipants (
    userid uuid NOT NULL,
    conversationid uuid NOT NULL,
    joinedat timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.conversationparticipants OWNER TO senpai;

--
-- Name: conversations; Type: TABLE; Schema: public; Owner: senpai
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    type character varying(50) NOT NULL,
    name character varying(255),
    createdat timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.conversations OWNER TO senpai;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: senpai
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversationid uuid NOT NULL,
    senderid uuid NOT NULL,
    content text NOT NULL,
    sentat timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    isread boolean DEFAULT false
);


ALTER TABLE public.messages OWNER TO senpai;

--
-- Name: users; Type: TABLE; Schema: public; Owner: senpai
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(255) NOT NULL,
    firstname character varying(255) NOT NULL,
    lastname character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    passwordhash character varying(255) NOT NULL,
    datecreated timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    userlanguage character varying(25)
);


ALTER TABLE public.users OWNER TO senpai;

--
-- Name: conversationparticipants conversationparticipants_pkey; Type: CONSTRAINT; Schema: public; Owner: senpai
--

ALTER TABLE ONLY public.conversationparticipants
    ADD CONSTRAINT conversationparticipants_pkey PRIMARY KEY (userid, conversationid);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: senpai
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: senpai
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: senpai
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: senpai
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: senpai
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: conversationparticipants conversationparticipants_conversationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: senpai
--

ALTER TABLE ONLY public.conversationparticipants
    ADD CONSTRAINT conversationparticipants_conversationid_fkey FOREIGN KEY (conversationid) REFERENCES public.conversations(id);


--
-- Name: conversationparticipants conversationparticipants_userid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: senpai
--

ALTER TABLE ONLY public.conversationparticipants
    ADD CONSTRAINT conversationparticipants_userid_fkey FOREIGN KEY (userid) REFERENCES public.users(id);


--
-- Name: messages messages_conversationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: senpai
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversationid_fkey FOREIGN KEY (conversationid) REFERENCES public.conversations(id);


--
-- Name: messages messages_senderid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: senpai
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_senderid_fkey FOREIGN KEY (senderid) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--