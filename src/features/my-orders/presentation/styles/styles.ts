import { StyleSheet } from "@react-pdf/renderer";

export const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },

  header: {
    marginBottom: 20,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 10,
    color: "#6b7280",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  card: {
    width: "31%",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    marginRight: "3%",
  },

  label: {
    fontSize: 8,
    color: "#9ca3af",
    marginBottom: 4,
    textTransform: "uppercase",
  },

  value: {
    fontSize: 11,
    fontWeight: "bold",
  },

  table: {
    width: "100%",
    marginTop: 10,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#111827",
    color: "#ffffff",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
  },

  th: {
    padding: 8,
    fontSize: 9,
    fontWeight: "bold",
  },

  td: {
    padding: 8,
    fontSize: 9,
  },

  colProduct: { flex: 2 },
  col: { flex: 1, textAlign: "center" },

  footer: {
    position: "absolute",
    bottom: 20,
    left: 32,
    right: 32,
    borderTop: "1px solid #e5e7eb",
    paddingTop: 6,
    fontSize: 8,
    color: "#6b7280",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 10,
  },

  logo: {
    width: 80,
    height: 40,
  },

  headerText: {
    textAlign: "right",
  },
});