const db = require('../db')

class CommentsModel {
    constructor() {
        this.db = db
        this.table = 'comments'
    }

    /**
     * Select all comments
     */
    async selectAll() {
        const queryString = `
            SELECT * FROM ${this.table} 
            ORDER BY date DESC;
        `
        return this.db.query(queryString)
    }

    /**
     * Select by post id
     */
    async selectByPostId(postId) {
        const queryString = `
            SELECT * FROM ${this.table} 
            WHERE post_id = $1 
            ORDER BY date DESC;
        `

        const params = [postId]
        return this.db.query(queryString, params)
    }

    /**
     * Add comment
     */
    async addComment({ displayName, email, postId, postSlug, parentCommentId = 0, text }) {
        const queryString = `
            INSERT INTO ${this.table} (display_name, email, post_id, post_slug, parent_comment_id, text) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email, display_name;
        `
        const params = [displayName, email, postId, postSlug, parentCommentId, text]
        return this.db.query(queryString, params)
    }

    /**
     * Approve comment
     */
    async approveComment(id) {
        const queryString = `
            UPDATE ${this.table} 
            SET approved = TRUE 
            WHERE id = $1 
            RETURNING id, approved;
        `
        const params = [id]
        return this.db.query(queryString, params)
    }

    /**
     * Delete comment
     */
    async deleteComment(id) {
        const queryString = `
            WITH a AS (DELETE FROM ${this.table} WHERE id = $1 RETURNING 1)
            SELECT count(*) FROM a;
        `

        const params = [id]
        return this.db.query(queryString, params)
    }
}

module.exports = CommentsModel