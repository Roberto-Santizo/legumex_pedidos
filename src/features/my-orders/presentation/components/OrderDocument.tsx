import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { styles } from "@/features/my-orders/presentation/styles/styles";
import type { OrderConfirmed, OrderItemDetails, OrderTotals } from "../../my-orders";

type Props = {
    order: OrderConfirmed;
    products: OrderItemDetails[];
    totals: OrderTotals
}

export const OrderDocument = ({ order, products, totals }: Props) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.headerContainer}>
                <Image
                    src="https://legumexappsapi-storage.s3.us-east-1.amazonaws.com/resources/LOGO_LX.png"
                    style={styles.logo}
                />

                <View style={styles.headerText}>
                    <Text style={styles.title}>Order #{order.id}</Text>
                </View>
            </View>

            <View style={styles.grid}>
                <View style={styles.card}>
                    <Text style={styles.label}>Customer</Text>
                    <Text style={styles.value}>{order.customer}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.value}>Sent</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Total Boxes</Text>
                    <Text style={styles.value}>{totals.total_boxes}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Total Pounds</Text>
                    <Text style={styles.value}>{totals.total_lbs}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.label}>Total Amount</Text>
                    <Text style={styles.value}>${totals.total_price}</Text>
                </View>
            </View>

            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.th, styles.colProduct]}>Product</Text>
                    <Text style={[styles.th, styles.col]}>Code</Text>
                    <Text style={[styles.th, styles.col]}>Boxes</Text>
                    <Text style={[styles.th, styles.col]}>Lbs</Text>
                    <Text style={[styles.th, styles.col]}>PO</Text>
                </View>

                {products.map((p, i) => (
                    <View key={i} style={styles.tableRow}>
                        <Text style={[styles.td, styles.colProduct]}>{p.product}</Text>
                        <Text style={[styles.td, styles.col]}>{p.internationalCode}</Text>
                        <Text style={[styles.td, styles.col]}>{p.total_boxes}</Text>
                        <Text style={[styles.td, styles.col]}>{p.total_lbs}</Text>
                        <Text style={[styles.td, styles.col]}>{p.po}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.footer} fixed>
                <Text
                    render={({ pageNumber, totalPages }) =>
                        `Page ${pageNumber} of ${totalPages}`
                    }
                />
            </View>

        </Page>
    </Document>
);