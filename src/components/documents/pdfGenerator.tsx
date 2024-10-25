import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Definir los tipos de las columnas y los datos de la fila
interface Column {
    key: string;
    name: string;
}

interface MyPdfDocumentProps {
    tittle: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rowData: Record<string, any>;
    columns: Column[];
    logo: string;
    imageField?: string;
}

// Crear estilos para el PDF
const styles = StyleSheet.create({
    page: {
        padding: 30,
        position: 'relative', // Para que el footer esté posicionado relativo a la página
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 50,
        height: 50,
        marginLeft: 30
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        marginLeft: 50,
        gap: 10,
    },
    image: {
        marginTop: 10,
        width: 200,
        height: 150,
        alignSelf: 'center', // Alinear la imagen en el centro
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 30,
        right: 30,
        fontSize: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

// Obtener la fecha actual
const getCurrentDate = () => {
    const date = new Date();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

// Crear el documento PDF con imagen y footer
const PdfComponentProps: React.FC<MyPdfDocumentProps> = ({
    tittle,
    rowData,
    columns,
    logo,
    imageField,
}
) => (
    
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Cabecera con logo */}
            <View style={styles.header}>
                <Image style={styles.logo} src={logo} />
            </View>

            {/* Título */}
            <Text style={styles.title}>{tittle}</Text>

            {/* Datos de la tabla */}
            {columns.map((col) => (
                <View key={col.key} style={styles.section}>
                    <Text style={styles.text}>
                        <Text style={[styles.text, { fontWeight: 'bold', fontSize: 15 }]}>
                            {col.name}:{'\n'}
                        </Text>
                        <Text style={[styles.text, { marginLeft: 10 }]}>
                            {col.key === imageField ? '' : rowData[col.key] || 'N/A'}
                        </Text>
                    </Text>
                </View>
            ))}

            {/* Imagen al final del documento */}
            <Text style={[styles.text, { marginLeft: 10 }]}>
                {imageField && rowData[imageField] ? 'Imagen' : ''}
            </Text>
            

            {/* Footer con la fecha actual y número de página */}
            <View style={styles.footer}>
                <Text>Fecha: {getCurrentDate()}</Text>
                <Text
                    render={({ pageNumber, totalPages }) => (
                        `Página ${pageNumber} de ${totalPages}`
                    )}
                />
            </View>
        </Page>
    </Document>
);

export default PdfComponentProps;
