service cloud.firestore {
  match /databases/{database}/documents {

    // Progresos: documento con id que concatena uid + fecha
    match /progresos/{docId} {
      allow read, write: if request.auth != null
        && docId.split("_")[0] == request.auth.uid;
    }

    // Usuarios: documentos con id = userId
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /usuarios/{userId}/misiones/{misionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Ranking con subcolección 'entradas'
    match /ranking/{fecha}/entradas/{userId} {
      allow write: if request.auth != null && request.auth.uid == userId;
      allow read: if true;
    }
    
    // ✅ Reglas para la colección global de misiones
    match /misiones/{misionId} {
      allow read, write: if request.auth != null;
      // Opcional: permitir solo a admins escribir
      // allow write: if request.auth.token.admin == true;
    }
  }
}
