import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";
import type { Devis, Client } from "@shared/schema";

export class PDFService {
  async generateDevisPDF(devis: Devis, client: Client): Promise<string> {
    const doc = new jsPDF();
    
    // Entête du cabinet
    doc.setFontSize(20);
    doc.text("CRM Assurance - Mutuelle Santé", 20, 30);
    
    doc.setFontSize(12);
    doc.text("Votre courtier spécialisé en assurance santé", 20, 40);
    doc.text("Téléphone: 01 23 45 67 89", 20, 50);
    doc.text("Email: contact@crm-assurance.fr", 20, 60);
    
    // Ligne de séparation
    doc.line(20, 70, 190, 70);
    
    // Informations du devis
    doc.setFontSize(16);
    doc.text("DEVIS DE MUTUELLE SANTÉ", 20, 85);
    
    doc.setFontSize(12);
    doc.text(`Numéro de devis: ${devis.numeroDevis}`, 20, 100);
    doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 20, 110);
    doc.text(`Validité: ${new Date(devis.dateValidite).toLocaleDateString("fr-FR")}`, 20, 120);
    
    // Informations du client
    doc.setFontSize(14);
    doc.text("INFORMATIONS CLIENT", 20, 140);
    
    doc.setFontSize(12);
    doc.text(`Nom: ${client.nom} ${client.prenom}`, 20, 155);
    doc.text(`Email: ${client.email}`, 20, 165);
    doc.text(`Téléphone: ${client.telephone}`, 20, 175);
    doc.text(`Situation familiale: ${client.situationFamiliale}`, 20, 185);
    doc.text(`Nombre d'ayants droit: ${client.nombreAyantsDroit}`, 20, 195);
    
    // Détails du devis
    doc.setFontSize(14);
    doc.text("DÉTAILS DU DEVIS", 20, 215);
    
    doc.setFontSize(12);
    doc.text(`Type de devis: ${devis.typeDevis}`, 20, 230);
    doc.text(`Montant mensuel: ${devis.montantMensuel}€`, 20, 240);
    
    // Garanties
    if (devis.garanties) {
      doc.text("Garanties incluses:", 20, 255);
      let yPosition = 265;
      
      const garanties = typeof devis.garanties === 'string' 
        ? JSON.parse(devis.garanties) 
        : devis.garanties;
      
      Object.entries(garanties).forEach(([key, value]) => {
        doc.text(`- ${key}: ${value}`, 25, yPosition);
        yPosition += 10;
      });
    }
    
    // Observations
    if (devis.observations) {
      doc.text("Observations:", 20, yPosition + 10);
      doc.text(devis.observations, 20, yPosition + 20);
    }
    
    // Pied de page
    doc.setFontSize(10);
    doc.text("Ce devis est valable jusqu'à la date indiquée ci-dessus.", 20, 280);
    doc.text("N'hésitez pas à nous contacter pour toute question.", 20, 290);
    
    // Sauvegarder le PDF
    const uploadsDir = path.join(process.cwd(), "uploads", "devis");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const fileName = `devis_${devis.numeroDevis}.pdf`;
    const filePath = path.join(uploadsDir, fileName);
    
    doc.save(filePath);
    
    return filePath;
  }
}

export const pdfService = new PDFService();
