const fs = require('fs');
const path = require('path');

console.log('🔄 Forçage de l\'application complète...');

// Copier les fichiers complets vers les fichiers principaux
try {
  // Copier App.complete.tsx vers App.tsx
  const appCompleteContent = fs.readFileSync('src/App.complete.tsx', 'utf8');
  fs.writeFileSync('src/App.tsx', appCompleteContent);
  console.log('✅ App.tsx mis à jour');

  // Copier index.complete.tsx vers index.tsx
  const indexCompleteContent = fs.readFileSync('src/index.complete.tsx', 'utf8');
  fs.writeFileSync('src/index.tsx', indexCompleteContent);
  console.log('✅ index.tsx mis à jour');

  console.log('🎉 Application complète forcée avec succès!');
  console.log('📋 Redémarrez le serveur avec: npm start');
  
} catch (error) {
  console.error('❌ Erreur:', error.message);
}
