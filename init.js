/* Segna che il JavaScript e' attivo: solo in quel caso il contenuto parte
   invisibile, in attesa della dissolvenza d'ingresso (vedi le regole ".js"
   in styles.css). Senza JavaScript la classe non viene mai messa e la
   pagina si vede da subito.

   Deve restare in <head> e senza defer/async: se girasse dopo il primo
   disegno, il contenuto comparirebbe un istante prima di essere nascosto. */
document.documentElement.className = "js";
