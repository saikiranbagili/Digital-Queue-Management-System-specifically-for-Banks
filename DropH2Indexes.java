import java.sql.*;

public class DropH2Indexes {
    private static final String URL = "jdbc:h2:file:./data/bankqdb;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1";
    private static final String USER = "sa";
    private static final String PASS = "";

    public static void main(String[] args) {
        System.out.println("Inspecting and dropping indexes in H2...");
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement stmt = conn.createStatement()) {

            try {
                stmt.execute("ALTER TABLE QUEUE_TOKENS DROP CONSTRAINT IF EXISTS UK_JAU39JQJBHTCVD3OF694GDK7Q");
                System.out.println("Executed: ALTER TABLE QUEUE_TOKENS DROP CONSTRAINT IF EXISTS UK_JAU39JQJBHTCVD3OF694GDK7Q");
            } catch (Exception ex) {
                System.out.println("Drop constraint 1 error: " + ex.getMessage());
            }

            try (ResultSet rs = stmt.executeQuery("SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'QUEUE_TOKENS'")) {
                while (rs.next()) {
                    String cName = rs.getString("CONSTRAINT_NAME");
                    String cType = rs.getString("CONSTRAINT_TYPE");
                    System.out.println("Constraint in ./data: " + cName + " (" + cType + ")");
                    if ("UNIQUE".equalsIgnoreCase(cType)) {
                        try (Statement s2 = conn.createStatement()) {
                            s2.execute("ALTER TABLE QUEUE_TOKENS DROP CONSTRAINT \"" + cName + "\"");
                            System.out.println("DROPPED CONSTRAINT: " + cName);
                        } catch (Exception ex) {
                            System.out.println("Err dropping constraint: " + ex.getMessage());
                        }
                    }
                }
            }

            // Let's inspect all indexes from INFORMATION_SCHEMA.INDEXES
            try (ResultSet rs = stmt.executeQuery("SELECT * FROM INFORMATION_SCHEMA.INDEXES WHERE TABLE_NAME = 'QUEUE_TOKENS'")) {
                ResultSetMetaData meta = rs.getMetaData();
                int cols = meta.getColumnCount();
                System.out.println("Found columns: " + cols);
                for (int i = 1; i <= cols; i++) {
                    System.out.print(meta.getColumnName(i) + "\t");
                }
                System.out.println();

                while (rs.next()) {
                    for (int i = 1; i <= cols; i++) {
                        System.out.print(rs.getString(i) + "\t");
                    }
                    System.out.println();

                    String idxName = rs.getString("INDEX_NAME");
                    String idxSchema = rs.getString("INDEX_SCHEMA");
                    if (idxName.contains("UK_") || idxName.contains("TOKEN")) {
                        try (Statement s2 = conn.createStatement()) {
                            s2.execute("DROP INDEX IF EXISTS " + idxSchema + "." + idxName);
                            System.out.println("Successfully DROPPED: " + idxSchema + "." + idxName);
                        } catch (Exception e) {
                            System.out.println("Could not drop " + idxName + ": " + e.getMessage());
                        }
                    }
                }
            }

            System.out.println("Done inspecting and dropping!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
