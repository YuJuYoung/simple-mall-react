const express = require('express')
const router = express.Router()
const db = require('../db')

router.get('/', (req, res) => {
    db.query('SELECT id, title FROM post', (err, result) => {
        if (err) {
            return next(err)
        }
        res.json({
            list: result
        })
    })
})

router.get('/:postId', (req, res) => {
    db.query(
        'SELECT * FROM post WHERE id=?',
        [req.params.postId],
        (err, post) => {
        if (err) {
            return next(err)
        }

        db.query('SELECT * FROM product WHERE post_id=?',
        [req.params.postId],
        (err, product) => {
            if (err) {
                next(err)
            }

            res.json({
                post: post[0],
                product: product[0]
            })
        })
    })
})

router.post('/create', (req, res) => {
    var logined_id = req.session.logined_id;

    if (!logined_id) {
        res.json({
            result: false,
            message: '로그인 되어있지 않음'
        })
    }
    if (req.body.logined_id !== logined_id) {
        res.json({
            result: false,
            message: '다시 로그인 바람'
        })
    }

    var post = req.body.post;
    var product = req.body.product;

    db.query(
        'INSERT INTO post (title, description, user_id) VALUES (?, ?, ?)',
        [post.title, post.desc, logined_id],
        (err, result) => {
            if (err) {
                console.log(err)
            }
            console.log(result)
            db.query(
                'INSERT INTO product (name, price, user_id, post_id) VALUES (?, ?, ?, ?)',
                [product.name, product.price, logined_id, result.insertId],
                (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    res.json({
                        result: true
                    })
                }
            )
        }
    )
})

module.exports = router;