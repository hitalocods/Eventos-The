# EventosThe

App webmobile para mostrar eventos com música ao vivo em Teresina/PI.

## Arquivos

- `index.html`: tela pública com mapa, filtros, eventos de hoje e botão "Como chegar".
- `admin.html`: painel administrativo com login Firebase Auth, cadastro, edição e exclusão de eventos.

## Como rodar

Abra `index.html` no navegador. Para usar o banco real, substitua o bloco `firebaseConfig` em `index.html` e `admin.html` pelas credenciais do seu projeto Firebase.

Se quiser rodar como site local, abra o terminal dentro da pasta do projeto e execute:

```txt
node server.mjs
```

Depois acesse:

```txt
http://localhost:8080
http://localhost:8080/admin.html
```

## Firebase grátis

No Firebase Console:

1. Crie um projeto.
2. Ative o Firestore Database.
3. Ative Authentication > Sign-in method > E-mail/senha.
4. Crie um usuário admin em Authentication > Users.
5. Copie as credenciais do app web para o bloco `firebaseConfig`.

## Estrutura da coleção

Coleção: `eventos`

Campos usados:

- `dataEvento`: texto no formato `YYYY-MM-DD`
- `estabelecimento`: texto
- `banda`: texto
- `genero`: `pagode`, `forró`, `sertanejo`, `rock` ou `mpb`
- `cep`: texto
- `numero`: texto
- `bairro`: texto
- `endereco`: texto
- `latitude`: número
- `longitude`: número
- `valor`: texto
- `horario`: texto
- `horarioInicio`: texto no formato `HH:MM`, usado para ordenar eventos
- `status`: `ativo`, `cancelado` ou `encerrado`
- `destaque`: booleano
- `pagaDezPorCento`: booleano
- `criadoEm`: timestamp
- `atualizadoEm`: timestamp

## Regras iniciais recomendadas

Para MVP: qualquer pessoa lê eventos, usuários anônimos podem registrar métricas de clique, e só usuário autenticado cria, edita ou exclui eventos.

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

## Hospedagem gratuita

Depois, o caminho mais simples é Firebase Hosting. Você ganha um domínio gratuito parecido com:

```txt
https://teresina-tem-som.web.app
```
