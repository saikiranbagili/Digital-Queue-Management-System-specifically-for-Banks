import java.sql.*;

public class MigrateDatabase {
    private static final String URL = "jdbc:postgresql://dpg-db56098473hc73a0l52g-a.oregon-postgres.render.com:5432/bankq?ssl=true&sslmode=require";
    private static final String USER = "bankq_user";
    private static final String PASS = "yT9Z2Q2rImqmcO3EueJSvkjwst3ayyHT";

    public static void main(String[] args) {
        System.out.println("Running PostgreSQL database migration for Banks & Branches...");

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             Statement stmt = conn.createStatement()) {
            
            // 1. Add branch and bank columns to users if not present
            stmt.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS bank_name character varying(100)");
            stmt.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS branch character varying(100)");
            stmt.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS account_number character varying(100)");
            System.out.println(" Added bank_name, branch, account_number to users table.");

            // 2. Add branch and bank columns to queue_tokens if not present
            stmt.execute("ALTER TABLE queue_tokens ADD COLUMN IF NOT EXISTS bank_name character varying(100)");
            stmt.execute("ALTER TABLE queue_tokens ADD COLUMN IF NOT EXISTS branch character varying(100)");
            System.out.println(" Added bank_name, branch to queue_tokens table.");

            // 3. Drop all unique constraints on token_number in queue_tokens so separate branches have independent token sequences
            ResultSet rs = stmt.executeQuery("SELECT conname FROM pg_constraint WHERE conrelid = 'queue_tokens'::regclass AND contype = 'u'");
            while (rs.next()) {
                String conName = rs.getString("conname");
                try (Statement dropStmt = conn.createStatement()) {
                    dropStmt.execute("ALTER TABLE queue_tokens DROP CONSTRAINT \"" + conName + "\"");
                    System.out.println(" Dropped unique constraint: " + conName);
                }
            }

            // 4. Update legacy records to default bank & branch
            stmt.execute("UPDATE queue_tokens SET bank_name = 'SBI' WHERE bank_name IS NULL");
            stmt.execute("UPDATE queue_tokens SET branch = 'Ameerpet' WHERE branch IS NULL");
            stmt.execute("UPDATE users SET bank_name = 'SBI' WHERE bank_name IS NULL");
            stmt.execute("UPDATE users SET branch = 'Ameerpet' WHERE branch IS NULL");
            System.out.println(" Legacy records updated with default bank: SBI, branch: Ameerpet.");

            System.out.println("\nAll database migrations completed successfully!");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
