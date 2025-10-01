import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface PDFOptions {
  title: string
  content: string
  userInfo?: {
    name?: string
    email?: string
  }
}

export class PDFService {
  async generatePDF(options: PDFOptions): Promise<Blob> {
    const { title, content, userInfo } = options

    // Create a temporary div to render the content
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.top = '-9999px'
    tempDiv.style.width = '800px'
    tempDiv.style.padding = '40px'
    tempDiv.style.backgroundColor = '#ffffff'
    tempDiv.style.fontFamily = 'Inter, sans-serif'
    tempDiv.style.lineHeight = '1.6'
    tempDiv.style.color = '#374151'
    
    tempDiv.innerHTML = `
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #ec4899; font-size: 32px; margin-bottom: 10px; font-weight: 700;">Relationnel</h1>
        <h2 style="color: #6b7280; font-size: 24px; font-weight: 500;">Rapport de vos socles relationnels</h2>
        ${userInfo?.name ? `<p style="color: #9ca3af; font-size: 16px; margin-top: 10px;">Généré pour ${userInfo.name}</p>` : ''}
        <div style="border-bottom: 2px solid #fce7f3; margin: 20px 0;"></div>
      </div>
      <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.8;">
        ${content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
      </div>
      <div style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
        <p>Généré le ${new Date().toLocaleDateString('fr-FR')} par Relationnel</p>
      </div>
    `

    document.body.appendChild(tempDiv)

    try {
      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.scrollHeight
      })

      // Create PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Clean up
      document.body.removeChild(tempDiv)

      return pdf.output('blob')
    } catch (error) {
      document.body.removeChild(tempDiv)
      throw new Error('Erreur lors de la génération du PDF')
    }
  }

  downloadPDF(blob: Blob, filename: string = 'rapport-relationnel.pdf') {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export const pdfService = new PDFService()
