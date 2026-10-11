import java.sql.*;

public class MigrateH2 {
    private static final String URL = "jdbc:h2:file:./backend/data/bankqdb;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1";
    private static final String USER = "sa";
    private static final String PASS = "";

    public static void main(String[] args) {
        System.out.println("Migrating local H2 database...");
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement stmt = conn.createStatement()) {

            // Drop any unique index or constraint on token_number in H2
            try {
                stmt.execute("ALTER TABLE QUEUE_TOKENS DROP CONSTRAINT IF EXISTS UK_JAU39JQJBHTCVD3OF694GDK7Q");
                System.out.println(" Dropped UK_JAU39JQJBHTCVD3OF694GDK7Q constraint.");
            } catch (Exception e) {
                System.out.println(" Constraint drop note: " + e.getMessage());
            }

            try {
                stmt.execute("DROP INDEX IF EXISTS UK_JAU39JQJBHTCVD3OF694GDK7Q_INDEX_D");
                System.out.println(" Dropped UK_JAU39JQJBHTCVD3OF694GDK7Q_INDEX_D index.");
            } catch (Exception e) {
                System.out.println(" Index drop note: " + e.getMessage());
            }

            // Also check all constraints on QUEUE_TOKENS in H2
            ResultSet rs = stmt.executeQuery("SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_NAME = 'QUEUE_TOKENS' AND CONSTRAINT_TYPE = 'UNIQUE'");
            while (rs.next()) {
                String cName = rs.getString("CONSTRAINT_NAME");
                try (Statement dropStmt = conn.createStatement()) {
                    dropStmt.execute("ALTER TABLE QUEUE_TOKENS DROP CONSTRAINT \"" + cName + "\"");
                    System.out.println(" Dropped unique constraint: " + cName);
                } catch (Exception e) {
                    System.out.println(" Note: " + e.getMessage());
                }
            }

            System.out.println("Local H2 migration complete!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
