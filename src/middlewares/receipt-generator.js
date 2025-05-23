import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateReservationPDF = async (reservation,room,priceAmenity) => {
    try {
        const templatePath = path.join(__dirname, '..', '..', 'public', 'docs', 'Factura_A4_para_empresa_hotelera.pdf');
        const outputPathDir = path.join(__dirname, '..', '..', 'public', 'docs', 'receipt');

        if (!fs.existsSync(outputPathDir)) {
            fs.mkdirSync(outputPathDir, { recursive: true });
        }

        const pdfBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const { width, height } = firstPage.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const textColor = rgb(0, 0, 0);

        

        firstPage.drawText(`${room.number}`, {
            x: 190,
            y: height - 439,
            size: 12,
            font,
            color: textColor
        });

        firstPage.drawText(`$ ${room.price}.00`, {
            x: 380,
            y: height - 439,
            size: 12,
            font,
            color: textColor
        });

        firstPage.drawText(`$ ${room.price}.00`, {
            x: 490,
            y: height - 439,
            size: 12,
            font,
            color: textColor
        });

        firstPage.drawText(`${room.capacity}`, {
            x: 140,
            y: height - 485,
            size: 12,
            font,
            color: textColor
        });

        firstPage.drawText(`${room.amenity.length}`, {
            x: 297,
            y: height - 530,
            size: 12,
            font,
            color: textColor
        });

        firstPage.drawText(`$ ${priceAmenity}.00`, {
            x: 490,
            y: height - 530,
            size: 12,
            font,
            color: textColor
        });

        firstPage.drawText(`$ ${priceAmenity}.00`, {
            x: 380,
            y: height - 530,
            size: 12,
            font,
            color: textColor
        });

        firstPage.drawText(`$ ${priceAmenity + parseFloat(room.price)}.00`, {
            x: 380,
            y: height - 570,
            size: 12,
            font,
            color: textColor
        });

        firstPage.drawText(`${new Date(reservation.date).toLocaleDateString()}`, {
            x: 470,
            y: height - 87,
            size: 12,
            font,
            color: textColor
        });

        const formattedDate = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `reserva_${reservation.uid}_${formattedDate}.pdf`;
        const outputPath = path.join(outputPathDir, fileName);
        const modifiedPdfBytes = await pdfDoc.save();

        fs.writeFileSync(outputPath, modifiedPdfBytes);

        return outputPath;
    } catch (err) {
        throw err;
    }
};
