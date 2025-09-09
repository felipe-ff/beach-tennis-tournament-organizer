# Firebase Setup Instructions

Para configurar o Firebase e Firestore neste projeto:

## 1. Criar um projeto no Firebase Console
1. Acesse https://console.firebase.google.com/
2. Clique em "Criar um projeto"
3. Siga o assistente para criar seu projeto

## 2. Configurar Firestore
1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Começar no modo de teste" (para desenvolvimento)
4. Selecione uma localização próxima

## 3. Obter configuração do projeto
1. Vá para "Configurações do projeto" (ícone de engrenagem)
2. Na aba "Geral", role até "Seus aplicativos"
3. Clique em "</>" para criar um aplicativo web
4. Dê um nome ao app e clique em "Registrar aplicativo"
5. Copie a configuração do Firebase

## 4. Configurar o arquivo firebase.js
Edite o arquivo `src/config/firebase.js` e substitua os valores em `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "sua-api-key-aqui",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 5. Regras do Firestore (Opcional - para produção)
Para produção, configure regras mais restritivas no Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tournaments/{tournamentId} {
      allow read, write: if true; // Simplifique para teste
    }
  }
}
```

## Funcionalidades implementadas:
- ✅ Salvamento automático no Firestore
- ✅ Backup em localStorage
- ✅ Carregamento automático ao abrir a página
- ✅ URLs compartilháveis para torneios
- ✅ Indicador de salvamento
- ✅ Recuperação em caso de falha do Firestore

## Como usar:
1. Configure o Firebase conforme instruções acima
2. Crie um torneio normalmente
3. Os dados serão salvos automaticamente
4. Você pode compartilhar a URL para outros acessarem
5. Os dados persistem mesmo após refresh da página
