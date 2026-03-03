import pool from '../config/db.js';


export async function fetchDashboardData() {
    const [totalUserResult] = await pool.query(
        "SELECT COUNT(*) as total FROM User"
    );

    const totalUsers = totalUserResult[0].total;

    const [lastUsers] = await pool.query(
        "SELECT id, nome, email FROM User ORDER BY id DESC LIMIT 5"
    );

    return {
        totalUsers,
        lastUsers
    };
  }