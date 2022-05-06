const { successHandle, errorHandle } = require('../service/responseHandler')
const Post = require('../models/posts')

const posts = {
    /* GET */
    async getPosts(req, res, next) {
        try {
            const timeSort = req.query.timeSort == "asc" ? "createdAt" : "-createdAt"
            const q = req.query.keyword !== undefined ? { "content": new RegExp(req.query.keyword) } : {};
            const allPosts = await Post
                .find(q)
                .populate({
                    path: 'user',
                    select: 'name photo'
                }).sort(timeSort);
            successHandle(res, 200, allPosts)
        }
        catch (e) {
            console.error(e)
            errorHandle(res, 400, '取得 posts 錯誤')
        }
    },

    /* POST */
    async createPosts(req, res, next) {
        try {
            const { user, content, image } = req.body

            if (!content || !user) {
                errorHandle(res, 400, '資料不齊全')
                return
            }
            const newPost = await Post.create(
                {
                    user,
                    content,
                    image
                }
            );
            successHandle(res, 200, newPost)
        }
        catch (e) {
            console.error(e)
            errorHandle(res, 400, '建立 posts 錯誤')
        }
    },

    /* DELETE ALL */
    async deleteAllPosts(req, res, next) {
        try {
            await Post.deleteMany({});
            successHandle(res, 200, []);
        }
        catch (e) {
            console.error(e)
            errorHandle(res, 400, '刪除全部 posts 錯誤')
        }
    },

    /* DELETE ONE */
    async deleteOnePost(req, res, next) {
        try {
            const postId = req.params.id
            const result = await Post.findByIdAndDelete(postId);
            if (!result) {
                errorHandle(res, 400, '無此 Post')
                return
            }
            const posts = await Post.find()
            successHandle(res, 200, posts);

        } catch (e) {
            errorHandle(res, 400, '刪除單筆 posts 錯誤');
        }
    },

    /* PATCH */
    async patchPosts(req, res, next) {
        try {
            const postId = req.params.id
            const { content } = req.body;
            if (!content) {
                errorHandle(res, 400, '修改資料失敗，需填寫內文');
                return
            }
            const result = await Post.findByIdAndUpdate(postId, { content });
            if (!result) {
                errorHandle(res, 400, '無此 posts')
                return
            }
            const posts = await Post.find()
            successHandle(res, 200, posts)
        } catch {
            errorHandle(res, 400, '修改資料失敗，欄位名稱錯誤或無此 ID');
        }
    }
}

module.exports = posts 