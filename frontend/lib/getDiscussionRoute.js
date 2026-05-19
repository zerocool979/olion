export default function getDiscussionRoute(id, token) {
  return token ? `/user/discussions/${id}` : `/discussion/${id}`
}
