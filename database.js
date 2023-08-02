const { Pool } = require('pg')
const fs = require('fs');

class customerDB{
    constructor(){
        this.pool = new Pool({
            user: process.env.PGUSER,
            password: process.env.PGPASSWORD,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            port: process.env.PGPORT,
            sslcert: process.env.PGSSLROOTCERT,
            ssl: {
                rejectUnauthorized: false,
                ca: fs.readFileSync('./root.crt').toString()
            }

        });
    }

    async initialize() {
        const client = await this.pool.connect()

        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS customers (
                    id SERIAL PRIMARY KEY,
                    billing_name TEXT,
                    shipping_name TEXT,
                    billing_address TEXT,
                    shipping_address TEXT,
                    email TEXT,
                    phone_number TEXT,
                    username TEXT
                )
            `)
        } catch (error) {
            console.error('Failed to initialize database:', error);
        } finally {
            client.release()
        }
    }

    async addCustomer(billing_name, shipping_name, billing_address, shipping_address, email, phone_number, username) {
        const client = await this.pool.connect()

        try {
            const res = await client.query(`
                INSERT INTO customers(billing_name, shipping_name, billing_address, shipping_address, email, phone_number, username)
                VALUES($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `, [billing_name, shipping_name, billing_address, shipping_address, email, phone_number, username])

            return res.rows[0].id
        } finally {
            client.release()
        }
    }

    async doesCustomerExist(billing_name, shipping_name, billing_address, shipping_address, email, phone_number, username) {
        const client = await this.pool.connect()
        let res;
    
        try {
            if(billing_name){
                res = await client.query(`
                    SELECT * FROM customers WHERE billing_name = $1
                `, [billing_name])
            }
            else if(shipping_name){
                res = await client.query(`
                    SELECT * FROM customers WHERE shipping_name = $1
                `, [shipping_name])
            }
            else if(billing_address){
                res = await client.query(`
                    SELECT * FROM customers WHERE billing_address = $1
                `, [billing_address])
            }
            else if(shipping_address){
                res = await client.query(`
                    SELECT * FROM customers WHERE shipping_address = $1
                `, [shipping_address])
            }
            else if(email){
                res = await client.query(`
                    SELECT * FROM customers WHERE email = $1
                `, [email])
            }
            else if(phone_number){
                res = await client.query(`
                    SELECT * FROM customers WHERE phone_number = $1
                `, [phone_number])
            }
            else if(username){
                res = await client.query(`
                    SELECT * FROM customers WHERE username = $1
                `, [username])
            }
    
            return res.rowCount > 0
        } finally {
            client.release()
        }
    }

    async findAllCustomers() {
        const client = await this.pool.connect()

        try {
            const res = await client.query(`
                SELECT * FROM customers
            `)
            return res.rows
        } finally {
            client.release()
        }
    }

    async findCustomerbyBname(billing_name) {
        const client = await this.pool.connect()

        try {
            const res = await client.query(`
                SELECT * FROM customers WHERE billing_name = $1
            `, [billing_name])
            return res.rows
        } finally {
            client.release()
        }
    }

    async findCustomerbySname(shipping_name) {
        const client = await this.pool.connect()

        try {
            const res = await client.query(`
                SELECT * FROM customers WHERE shipping_name = $1
            `, [shipping_name])
            return res.rows
        } finally {
            client.release()
        }
    }

    async findCustomerbyBaddress(billing_address) {
        const client = await this.pool.connect()

        try {
            const res = await client.query(`
                SELECT * FROM customers WHERE billing_address = $1
            `, [billing_address])
            return res.rows
        } finally {
            client.release()
        }
    }

    async findCustomerbySaddress(shipping_address) {
        const client = await this.pool.connect()

        try {
            const res = await client.query(`
                SELECT * FROM customers WHERE shipping_address = $1
            `, [shipping_address])
            return res.rows
        } finally {
            client.release()
        }
    }

    async findCustomerbyEmail(email) {
        const client = await this.pool.connect()

        try {
            const res = await client.query(`
                SELECT * FROM customers WHERE email = $1
            `, [email])
            return res.rows
        } finally {
            client.release()
        }
    }

    async findCustomerbyPhone(phone_number) {
        const client = await this.pool.connect()

        try {
            const res = await client.query(`
                SELECT * FROM customers WHERE phone_number = $1
            `, [phone_number])
            return res.rows
        } finally {
            client.release()
        }
    }

    async findCustomerbyUsername(username) {
        const client = await this.pool.connect()

        try {
            const res = await client.query(`
                SELECT * FROM customers WHERE username = $1
            `, [username])
            return res.rows
        } finally {
            client.release()
        }
    }

    // For a generic attribute filter function
    async findByAttributes(filters) {
        const client = await this.pool.connect()

        // assuming filters is an array of objects like [{column: 'column_name', value: 'value'}, ...]
        let conditions = filters.map((filter, i) => `${filter.column} = $${i + 1}`).join(' AND ')
        let values = filters.map(filter => filter.value)

        try {
            const res = await client.query(`
                SELECT * FROM customers WHERE ${conditions}
            `, values)

            return res.rows
        } finally {
            client.release()
        }
    }

}

module.exports = customerDB;