import java.sql.*;
import java.io.PrintWriter;
import java.io.FileWriter;
import java.io.File;

public class QueryDatabase {
    private static final String URL = "jdbc:postgresql://dpg-db56098473hc73a0l52g-a.oregon-postgres.render.com:5432/bankq?ssl=true&sslmode=require";
    private static final String USER = "bankq_user";
    private static final String PASS = "yT9Z2Q2rImqmcO3EueJSvkjwst3ayyHT";

    public static void main(String[] args) {
        System.out.println("Connecting to Live Render PostgreSQL: bankq-db...");

        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            System.out.println(" Connected to cloud PostgreSQL successfully!\n");

            // If user passed a custom SQL query argument
            if (args != null && args.length > 0 && !args[0].trim().isEmpty()) {
                String sql = String.join(" ", args).trim();
                executeCustomQuery(conn, sql);
                return;
            }

            // Generate HTML for both root and frontend/public
            generateHtmlViewer(conn, "DATABASE_VIEWER.html");

            File publicDir = new File("frontend/public");
            if (!publicDir.exists()) {
                publicDir.mkdirs();
            }
            generateHtmlViewer(conn, "frontend/public/database.html");

            System.out.println("Generated DATABASE_VIEWER.html and frontend/public/database.html successfully!");

        } catch (Exception e) {
            System.err.println("Database connection or query failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static void executeCustomQuery(Connection conn, String sql) {
        System.out.println("Executing SQL: " + sql);
        System.out.println("--------------------------------------------------------------------------------");
        try (Statement stmt = conn.createStatement()) {
            boolean isResultSet = stmt.execute(sql);
            if (isResultSet) {
                try (ResultSet rs = stmt.getResultSet()) {
                    ResultSetMetaData meta = rs.getMetaData();
                    int colCount = meta.getColumnCount();

                    for (int i = 1; i <= colCount; i++) {
                        System.out.printf("%-20s", meta.getColumnName(i));
                    }
                    System.out.println();
                    System.out.println("-".repeat(Math.max(40, colCount * 20)));

                    int count = 0;
                    while (rs.next()) {
                        count++;
                        for (int i = 1; i <= colCount; i++) {
                            String val = rs.getString(i);
                            System.out.printf("%-20s", (val == null ? "NULL" : (val.length() > 18 ? val.substring(0, 15) + "..." : val)));
                        }
                        System.out.println();
                    }
                    System.out.println("--------------------------------------------------------------------------------");
                    System.out.println("Rows returned: " + count + "\n");
                }
            } else {
                int affected = stmt.getUpdateCount();
                System.out.println("Query executed successfully. Rows affected: " + affected);
            }
        } catch (Exception e) {
            System.err.println("SQL Execution Error: " + e.getMessage());
        }
    }

    private static void generateHtmlViewer(Connection conn, String filePath) {
        try (PrintWriter html = new PrintWriter(new FileWriter(filePath))) {
            html.println("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'>");
            html.println("<title>BankQ - Live Cloud Database Explorer & Search</title>");
            html.println("<style>");
            html.println(":root { --bg: #0b0f19; --card-bg: #111827; --card-border: #1f2937; --text: #f3f4f6; --muted: #9ca3af; --primary: #3b82f6; --accent: #06b6d4; }");
            html.println("* { box-sizing: border-box; }");
            html.println("body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); padding: 1.5rem 2rem; margin: 0; min-height: 100vh; }");
            html.println(".header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--card-border); }");
            html.println("h1 { margin: 0; font-size: 1.6rem; color: #60a5fa; display: flex; align-items: center; gap: 0.6rem; }");
            html.println(".badge { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 500; }");
            html.println(".db-uri { background: #1e293b; padding: 0.4rem 0.8rem; border-radius: 8px; font-family: monospace; font-size: 0.82rem; color: #cbd5e1; border: 1px solid #334155; display: inline-flex; align-items: center; gap: 0.5rem; }");
            html.println(".nav-links { display: flex; gap: 0.6rem; }");
            html.println(".btn { background: #2563eb; color: #fff; text-decoration: none; padding: 0.45rem 0.9rem; border-radius: 8px; font-size: 0.85rem; font-weight: 500; display: inline-flex; align-items: center; gap: 0.4rem; border: none; cursor: pointer; transition: background 0.15s; }");
            html.println(".btn:hover { background: #1d4ed8; }");
            html.println(".btn-secondary { background: #1f2937; color: #d1d5db; border: 1px solid #374151; }");
            html.println(".btn-secondary:hover { background: #374151; color: #fff; }");
            html.println(".search-box-wrap { margin-bottom: 2rem; position: sticky; top: 1rem; z-index: 50; }");
            html.println(".search-input { width: 100%; padding: 0.9rem 1.25rem 0.9rem 3rem; background: #1f2937; border: 2px solid #374151; border-radius: 12px; color: #fff; font-size: 1.05rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.4); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }");
            html.println(".search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.3); }");
            html.println(".search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); font-size: 1.2rem; color: #9ca3af; pointer-events: none; }");
            html.println(".search-count { position: absolute; right: 1rem; top: 50%; transform: translateY(-50%); color: #9ca3af; font-size: 0.85rem; background: #111827; padding: 0.2rem 0.6rem; border-radius: 6px; }");
            html.println(".tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; overflow-x: auto; padding-bottom: 0.25rem; }");
            html.println(".tab-btn { background: #111827; border: 1px solid #1f2937; color: #9ca3af; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: all 0.15s; }");
            html.println(".tab-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; }");
            html.println(".tab-btn:hover:not(.active) { background: #1f2937; color: #e5e7eb; }");
            html.println(".table-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 12px; padding: 1.25rem; margin-bottom: 2rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); }");
            html.println(".table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }");
            html.println("h2 { margin: 0; color: #f1f5f9; font-size: 1.2rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }");
            html.println(".table-count { color: #94a3b8; font-size: 0.85rem; font-weight: normal; }");
            html.println(".table-wrap { overflow-x: auto; max-width: 100%; border-radius: 8px; border: 1px solid var(--card-border); }");
            html.println("table { width: 100%; border-collapse: collapse; font-size: 0.88rem; text-align: left; }");
            html.println("th { background: #1f2937; color: #9ca3af; padding: 0.75rem 1rem; border-bottom: 2px solid var(--card-border); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; white-space: nowrap; }");
            html.println("td { padding: 0.75rem 1rem; border-bottom: 1px solid #1f2937; color: #e5e7eb; white-space: nowrap; }");
            html.println("tr:hover td { background: #1e293b; }");
            html.println(".role-pill, .status-pill { display: inline-block; padding: 0.2rem 0.55rem; border-radius: 6px; font-weight: 600; font-size: 0.75rem; }");
            html.println(".role-admin { background: rgba(220, 38, 38, 0.2); color: #fca5a5; border: 1px solid rgba(220, 38, 38, 0.4); }");
            html.println(".role-staff { background: rgba(37, 99, 235, 0.2); color: #bfdbfe; border: 1px solid rgba(37, 99, 235, 0.4); }");
            html.println(".role-customer { background: rgba(22, 163, 74, 0.2); color: #bbf7d0; border: 1px solid rgba(22, 163, 74, 0.4); }");
            html.println(".status-waiting { background: rgba(234, 179, 8, 0.2); color: #fde047; border: 1px solid rgba(234, 179, 8, 0.4); }");
            html.println(".status-called { background: rgba(147, 51, 234, 0.2); color: #d8b4fe; border: 1px solid rgba(147, 51, 234, 0.4); }");
            html.println(".status-completed { background: rgba(22, 163, 74, 0.2); color: #86efac; border: 1px solid rgba(22, 163, 74, 0.4); }");
            html.println(".status-active { background: rgba(6, 182, 212, 0.2); color: #67e8f9; border: 1px solid rgba(6, 182, 212, 0.4); }");
            html.println(".highlight { background: rgba(234, 179, 8, 0.4); color: #fff; padding: 0.1rem 0.2rem; border-radius: 3px; }");
            html.println(".no-matches { text-align: center; color: #9ca3af; padding: 2rem; font-style: italic; }");
            html.println("</style></head><body>");

            html.println("<div class='header'>");
            html.println("  <div>");
            html.println("    <h1>🏦 BankQ Live Cloud Database <span class='badge'>Connected to Render PostgreSQL</span></h1>");
            html.println("    <p style='color:#9ca3af;margin:0.4rem 0 0 0;font-size:0.9rem;'>Cloud Host: <code>dpg-db56098473hc73a0l52g-a.oregon-postgres.render.com</code> &bull; Database: <code>bankq</code></p>");
            html.println("  </div>");
            html.println("  <div class='nav-links'>");
            html.println("    <a class='btn' href='https://digital-queue-management-system-spe.vercel.app/admin' target='_blank'>🖥️ Open Admin Dashboard</a>");
            html.println("    <a class='btn btn-secondary' href='https://dashboard.render.com/d/dpg-db56098473hc73a0l52g' target='_blank'>☁️ Render Cloud Console</a>");
            html.println("  </div>");
            html.println("</div>");

            html.println("<div class='search-box-wrap'>");
            html.println("  <span class='search-icon'>🔍</span>");
            html.println("  <input id='searchInput' class='search-input' type='text' placeholder='Search anything across all database tables (e.g. name, email, token, status, counter)...' autofocus oninput='filterTables()'>");
            html.println("  <span id='searchCount' class='search-count'>Type to search</span>");
            html.println("</div>");

            html.println("<div class='tabs'>");
            html.println("  <button class='tab-btn active' onclick=\"switchTab('all', this)\">All Tables</button>");
            html.println("  <button class='tab-btn' onclick=\"switchTab('table-users', this)\">Users</button>");
            html.println("  <button class='tab-btn' onclick=\"switchTab('table-queue_tokens', this)\">Queue Tokens</button>");
            html.println("  <button class='tab-btn' onclick=\"switchTab('table-counters', this)\">Counters</button>");
            html.println("  <button class='tab-btn' onclick=\"switchTab('table-banking_services', this)\">Banking Services</button>");
            html.println("</div>");

            String[] tables = {"users", "queue_tokens", "counters", "banking_services"};
            for (String tableName : tables) {
                printAndGenerateTable(conn, tableName, html);
            }

            html.println("<script>");
            html.println("function filterTables() {");
            html.println("  const query = document.getElementById('searchInput').value.trim().toLowerCase();");
            html.println("  const rows = document.querySelectorAll('tbody tr');");
            html.println("  let matchCount = 0;");
            html.println("  if (!query) {");
            html.println("    rows.forEach(r => r.style.display = '');");
            html.println("    document.getElementById('searchCount').textContent = 'Showing all rows';");
            html.println("    return;");
            html.println("  }");
            html.println("  rows.forEach(r => {");
            html.println("    const text = r.textContent.toLowerCase();");
            html.println("    if (text.includes(query)) {");
            html.println("      r.style.display = '';");
            html.println("      matchCount++;");
            html.println("    } else {");
            html.println("      r.style.display = 'none';");
            html.println("    }");
            html.println("  });");
            html.println("  document.getElementById('searchCount').textContent = matchCount + ' matching row(s)';");
            html.println("}");
            html.println("function switchTab(tableId, btn) {");
            html.println("  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));");
            html.println("  btn.classList.add('active');");
            html.println("  const cards = document.querySelectorAll('.table-card');");
            html.println("  if (tableId === 'all') {");
            html.println("    cards.forEach(c => c.style.display = '');");
            html.println("  } else {");
            html.println("    cards.forEach(c => c.style.display = (c.id === tableId ? '' : 'none'));");
            html.println("  }");
            html.println("}");
            html.println("</script>");

            html.println("</body></html>");

        } catch (Exception e) {
            System.err.println("Error generating HTML viewer: " + e.getMessage());
        }
    }

    private static void printAndGenerateTable(Connection conn, String tableName, PrintWriter html) {
        String sql = "SELECT * FROM " + tableName + " ORDER BY 1 ASC";
        try (Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            ResultSetMetaData meta = rs.getMetaData();
            int colCount = meta.getColumnCount();

            System.out.println("================================================================================");
            System.out.println(" TABLE: " + tableName.toUpperCase());
            System.out.println("================================================================================");

            html.println("<div class='table-card' id='table-" + tableName + "'>");
            html.println("<div class='table-header'><h2>📦 " + tableName.toUpperCase() + "</h2></div>");
            html.println("<div class='table-wrap'><table><thead><tr>");

            for (int i = 1; i <= colCount; i++) {
                System.out.printf("%-20s", meta.getColumnName(i));
                html.print("<th>" + meta.getColumnName(i) + "</th>");
            }
            System.out.println();
            html.println("</tr></thead><tbody>");

            int rowCount = 0;
            while (rs.next()) {
                rowCount++;
                html.println("<tr>");
                for (int i = 1; i <= colCount; i++) {
                    String colName = meta.getColumnName(i);
                    String val = rs.getString(i);
                    System.out.printf("%-20s", (val == null ? "NULL" : (val.length() > 18 ? val.substring(0, 15) + "..." : val)));
                    
                    if ("role".equalsIgnoreCase(colName)) {
                        String pillClass = "role-customer";
                        if ("ADMIN".equalsIgnoreCase(val)) pillClass = "role-admin";
                        else if ("STAFF".equalsIgnoreCase(val)) pillClass = "role-staff";
                        html.print("<td><span class='role-pill " + pillClass + "'>" + val + "</span></td>");
                    } else if ("status".equalsIgnoreCase(colName)) {
                        String pillClass = "status-active";
                        if ("WAITING".equalsIgnoreCase(val)) pillClass = "status-waiting";
                        else if ("CALLED".equalsIgnoreCase(val)) pillClass = "status-called";
                        else if ("COMPLETED".equalsIgnoreCase(val)) pillClass = "status-completed";
                        html.print("<td><span class='status-pill " + pillClass + "'>" + val + "</span></td>");
                    } else if ("branch".equalsIgnoreCase(colName)) {
                        html.print("<td><span style='background:rgba(124,58,237,0.2);color:#c4b5fd;border:1px solid rgba(124,58,237,0.4);padding:0.2rem 0.55rem;border-radius:6px;font-weight:600;font-size:0.78rem'>📍 " + (val == null ? "NULL" : val) + "</span></td>");
                    } else if ("bank_name".equalsIgnoreCase(colName)) {
                        html.print("<td><span style='background:rgba(2,132,199,0.2);color:#7dd3fc;border:1px solid rgba(2,132,199,0.4);padding:0.2rem 0.55rem;border-radius:6px;font-weight:600;font-size:0.78rem'>🏛️ " + (val == null ? "NULL" : val) + "</span></td>");
                    } else {
                        html.print("<td>" + (val == null ? "<i style='color:#64748b'>NULL</i>" : val) + "</td>");
                    }
                }
                System.out.println();
                html.println("</tr>");
            }

            if (rowCount == 0) {
                System.out.println("  (No rows found)");
                html.println("<tr><td colspan='" + colCount + "' class='no-matches'>No rows in table</td></tr>");
            }

            html.println("</tbody></table></div></div>");
            System.out.println("Total Rows: " + rowCount + "\n");

        } catch (Exception e) {
            System.out.println("Error querying table " + tableName + ": " + e.getMessage() + "\n");
        }
    }
}
