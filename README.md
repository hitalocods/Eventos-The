# EventosThe

App webmobile para mostrar eventos com musica ao vivo em Teresina/PI.

## Arquivos

- `src/app/**`: rotas do Next.js.
- `src/app/admin/**`: painel administrativo migrado para React/Next.
- `src/app/HomeClient.tsx`: pagina principal com mapa migrada para React/Next.
- `src/app/patrocinadores/**`: pagina comercial de patrocinadores.
- `public/`: imagens, icones e manifesto servidos como assets estaticos.

## Como rodar com Next.js

Instale as dependencias uma vez:

```txt
npm.cmd install
```

Rode o servidor de desenvolvimento:

```txt
npm.cmd run dev
```

Depois acesse:

```txt
http://localhost:3000
http://localhost:3000/admin
http://localhost:3000/patrocinadores
```

Valide o build de producao:

```txt
npm.cmd run build
```

As rotas `/`, `/admin` e `/patrocinadores` ja rodam como paginas React/Next. As rotas antigas `/embaixadores` e `/seja-embaixador` redirecionam para `/patrocinadores`.
A proxima etapa recomendada e preparar a integracao de cobranca via Pagar.me.

## Firebase

O projeto ainda usa Firebase Auth e Firestore. No admin, a configuracao ja fica no modulo Next `src/app/admin/firebase-client.ts` e pode ser sobrescrita por variaveis de ambiente:

```txt
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

No Firebase Console:

1. Crie um projeto.
2. Ative o Firestore Database.
3. Ative Authentication > Sign-in method > E-mail/senha.
4. Crie um usuario admin em Authentication > Users.
5. Configure as variaveis `NEXT_PUBLIC_FIREBASE_*` no ambiente.

## Estrutura da colecao

Colecao: `eventos`

Campos usados:

- `dataEvento`: texto no formato `YYYY-MM-DD`
- `estabelecimento`: texto
- `banda`: texto
- `genero`: `pagode`, `forro`, `sertanejo`, `rock` ou `mpb`
- `cep`: texto
- `numero`: texto
- `bairro`: texto
- `endereco`: texto
- `latitude`: numero
- `longitude`: numero
- `valor`: texto
- `horario`: texto
- `horarioInicio`: texto no formato `HH:MM`, usado para ordenar eventos
- `status`: `ativo`, `cancelado` ou `encerrado`
- `destaque`: booleano
- `pagaDezPorCento`: booleano
- `criadoEm`: timestamp
- `atualizadoEm`: timestamp

## Regras iniciais recomendadas

Para MVP: qualquer pessoa le eventos, usuarios anonimos podem registrar metricas de clique, e so usuario autenticado cria, edita ou exclui eventos.

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /eventos/{eventoId} {
      allow read: if true;
      allow create, delete: if request.auth != null;
      allow update: if request.auth != null || onlyMetricsChanged();

      function onlyMetricsChanged() {
        return request.resource.data.diff(resource.data).affectedKeys().hasOnly(['metricas']);
      }
    }
  }
}
```

## Hospedagem

Com Next.js e futura cobranca via Pagar.me, o caminho mais direto e hospedar em uma plataforma que execute rotas de servidor e webhooks, como Vercel. O Firebase continua podendo ser usado como Auth/Firestore.
