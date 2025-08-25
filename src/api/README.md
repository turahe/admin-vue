# 🚀 API Documentation

This directory contains comprehensive CRUD APIs for managing the core entities of the Vue Element Plus Admin application.

## 📁 API Structure

```
src/api/
├── common/
│   ├── types.ts        # Shared TypeScript interfaces
│   └── index.ts        # Common utilities and legacy APIs
├── menu/
│   ├── index.ts        # Menu CRUD operations
│   └── types.ts        # Menu-specific types
├── role/
│   ├── index.ts        # Role & Permission management
│   └── types.ts        # Role-specific types
├── category/
│   ├── index.ts        # Category CRUD operations
│   └── types.ts        # Category-specific types
├── tag/
│   ├── index.ts        # Tag management
│   └── types.ts        # Tag-specific types
├── blog/
│   ├── index.ts        # Blog/Post management
│   └── types.ts        # Blog-specific types
└── image/
    ├── index.ts        # Image upload & management
    └── types.ts        # Image-specific types
```

## 🎯 Core Entities

### 1. 🗂️ **Menu Management** (`/api/menu/`)

Hierarchical navigation menu system with permissions.

**Key Features:**

- ✅ Tree structure support (parent/child relationships)
- ✅ Permission-based access control
- ✅ Sort order management
- ✅ Visibility toggle
- ✅ Path validation
- ✅ Icon management

**Main Operations:**

```typescript
// Basic CRUD
getMenuListApi(params) // Paginated list
getMenuTreeApi(filters) // Hierarchical tree
getMenuByIdApi(id) // Single menu
createMenuApi(data) // Create new
updateMenuApi(id, data) // Update existing
deleteMenuApi(id) // Delete

// Advanced Operations
bulkDeleteMenusApi(data) // Bulk delete
updateMenuSortApi(data) // Reorder menus
toggleMenuVisibilityApi(id) // Show/hide
validateMenuPathApi(path) // Path uniqueness
getMenuStatsApi() // Statistics
```

### 2. 👥 **Role & Permission Management** (`/api/role/`)

Comprehensive role-based access control system.

**Key Features:**

- ✅ Role hierarchy with permissions
- ✅ Permission assignment/removal
- ✅ Bulk operations
- ✅ Status management
- ✅ User role relationships

**Main Operations:**

```typescript
// Role CRUD
getRoleListApi(params) // Paginated roles
getRoleByIdApi(id) // Single role
createRoleApi(data) // Create role
updateRoleApi(id, data) // Update role
deleteRoleApi(id) // Delete role

// Permission Management
getPermissionsApi() // All permissions
assignPermissionsApi(roleId, permissionIds)
removePermissionsApi(roleId, permissionIds)
checkRolePermissionApi(roleId, permission)

// Advanced Operations
bulkUpdateRolesApi(data) // Bulk updates
toggleRoleStatusApi(id) // Enable/disable
validateRoleKeyApi(key) // Key uniqueness
```

### 3. 📂 **Category Management** (`/api/category/`)

Hierarchical content categorization system.

**Key Features:**

- ✅ Tree structure (parent/child categories)
- ✅ SEO optimization (slugs, meta tags)
- ✅ Image support
- ✅ Post counting
- ✅ Status management

**Main Operations:**

```typescript
// Basic CRUD
getCategoryListApi(params) // Paginated list
getCategoryTreeApi(filters) // Tree structure
getCategoryByIdApi(id) // Single category
getCategoryBySlugApi(slug) // By URL slug
createCategoryApi(data) // Create new
updateCategoryApi(id, data) // Update existing

// Advanced Operations
moveCategoryApi(id, parentId) // Change parent
getPopularCategoriesApi(limit) // Most used
searchCategoriesApi(query) // Full-text search
generateCategorySlugApi(name) // Auto-generate slug
```

### 4. 🏷️ **Tag Management** (`/api/tag/`)

Flexible tagging system for content organization.

**Key Features:**

- ✅ Color-coded tags
- ✅ Usage statistics
- ✅ Tag cloud generation
- ✅ Related tags
- ✅ Trending analysis

**Main Operations:**

```typescript
// Basic CRUD
getTagListApi(params) // Paginated tags
getTagByIdApi(id) // Single tag
getTagBySlugApi(slug) // By URL slug
createTagApi(data) // Create new
updateTagApi(id, data) // Update existing

// Advanced Operations
getPopularTagsApi(limit) // Most used tags
getTrendingTagsApi(days, limit) // Trending tags
getTagCloudApi(limit) // Tag cloud data
getRelatedTagsApi(tagId) // Related tags
mergeTagsApi(targetId, sourceIds) // Merge tags
```

### 5. 📝 **Blog Management** (`/api/blog/`)

Comprehensive blog/post management system.

**Key Features:**

- ✅ Draft/Published/Scheduled states
- ✅ Category and tag relationships
- ✅ SEO optimization
- ✅ Reading time calculation
- ✅ View/like tracking
- ✅ Author management

**Main Operations:**

```typescript
// Basic CRUD
getBlogListApi(params) // Paginated blogs
getPublishedBlogsApi(params) // Published only
getBlogByIdApi(id) // Single blog
getBlogBySlugApi(slug) // By URL slug
createBlogApi(data) // Create new
updateBlogApi(id, data) // Update existing

// Publishing Workflow
publishBlogApi(id, publishedAt) // Publish blog
unpublishBlogApi(id) // Revert to draft
scheduleBlogApi(id, publishedAt) // Schedule publication
archiveBlogApi(id) // Archive blog

// Advanced Operations
getRelatedBlogsApi(blogId) // Related posts
getPopularBlogsApi(days) // Popular posts
searchBlogsApi(query) // Full-text search
duplicateBlogApi(id) // Duplicate post
analyzeBlogSEOApi(data) // SEO analysis
```

### 6. 🖼️ **Image Management** (`/api/image/`)

Complete image upload and management system.

**Key Features:**

- ✅ Multiple upload methods (file, URL)
- ✅ Image optimization and conversion
- ✅ Folder organization
- ✅ Tag-based categorization
- ✅ Usage tracking
- ✅ Automatic thumbnails

**Main Operations:**

```typescript
// Upload Operations
uploadImageApi(data) // Single upload
uploadMultipleImagesApi(files) // Bulk upload
uploadFromUrlApi(url) // Upload from URL

// Basic CRUD
getImageListApi(params) // Paginated images
getImageByIdApi(id) // Single image
updateImageApi(id, data) // Update metadata
deleteImageApi(id) // Delete image

// Advanced Operations
optimizeImageApi(id, options) // Compress/resize
convertImageFormatApi(id, format) // Format conversion
generateImageVariationsApi(id) // Create thumbnails
getImageUsageApi(id) // Usage tracking
cleanupUnusedImagesApi() // Remove unused
```

## 🔧 Common Patterns

### Pagination

All list APIs support standardized pagination:

```typescript
interface PaginationParams {
  page?: number // Page number (1-based)
  pageSize?: number // Items per page
  sortBy?: string // Sort field
  sortOrder?: 'asc' | 'desc' // Sort direction
}
```

### Filtering

Most APIs support flexible filtering:

```typescript
interface BaseFilters {
  search?: string // Full-text search
  status?: string // Status filter
  dateFrom?: string // Date range start
  dateTo?: string // Date range end
}
```

### Bulk Operations

Consistent bulk operation patterns:

```typescript
// Bulk delete
bulkDeleteApi({ ids: [1, 2, 3] })

// Bulk update
bulkUpdateApi({
  ids: [1, 2, 3],
  data: { status: 'active' }
})
```

### Response Format

Standardized API response structure:

```typescript
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

interface ListResponse<T> extends ApiResponse<PaginationResponse<T>> {}
```

## 🎨 TypeScript Integration

All APIs are fully typed with comprehensive TypeScript interfaces:

```typescript
import { getBlogListApi, Blog, BlogCreateRequest, BlogFilters } from '@/api/blog'

// Fully typed API calls
const blogs = await getBlogListApi({
  page: 1,
  pageSize: 10,
  status: 'published',
  categoryId: 5
})

// Type-safe data handling
const blog: Blog = blogs.data.data[0]
```

## 🔒 Authentication & Permissions

All APIs integrate with the authentication system:

```typescript
// Automatic token injection
const response = await createBlogApi(blogData)

// Permission checking
const hasPermission = await checkRolePermissionApi(roleId, 'blog:create')
```

## 📊 Statistics & Analytics

Each entity provides comprehensive statistics:

```typescript
// Get detailed statistics
const menuStats = await getMenuStatsApi()
const blogStats = await getBlogStatsApi()
const imageStats = await getImageStatsApi()

// Usage examples
console.log(`Total blogs: ${blogStats.data.total}`)
console.log(`Published: ${blogStats.data.published}`)
console.log(`Average reading time: ${blogStats.data.avgReadingTime} minutes`)
```

## 🚀 Usage Examples

### Creating a Blog Post with Category and Tags

```typescript
import { createBlogApi, getCategoryBySlugApi, getTagBySlugApi } from '@/api'

// Get category and tags
const category = await getCategoryBySlugApi('technology')
const tags = await Promise.all([getTagBySlugApi('vue'), getTagBySlugApi('typescript')])

// Create blog post
const blog = await createBlogApi({
  title: 'Vue 3 with TypeScript',
  slug: 'vue-3-typescript',
  content: '...',
  categoryId: category.data.id,
  tagIds: tags.map((tag) => tag.data.id),
  status: 'published'
})
```

### Image Upload with Optimization

```typescript
import { uploadImageApi, optimizeImageApi } from '@/api/image'

// Upload image
const image = await uploadImageApi({
  file: selectedFile,
  alt: 'Blog featured image',
  folder: 'blog-images',
  tags: ['featured', 'blog'],
  isPublic: true
})

// Optimize after upload
await optimizeImageApi(image.data.id, {
  quality: 80,
  width: 1200,
  format: 'webp'
})
```

### Building a Menu Tree

```typescript
import { getMenuTreeApi, createMenuApi } from '@/api/menu'

// Get current menu structure
const menuTree = await getMenuTreeApi({ visible: true })

// Add new menu item
await createMenuApi({
  name: 'Blog Management',
  path: '/blog',
  icon: 'blog',
  parentId: adminMenuId,
  permission: 'blog:read',
  sort: 10
})
```

## 🛠️ Development Guidelines

### 1. **Error Handling**

```typescript
try {
  const result = await createBlogApi(data)
  // Handle success
} catch (error) {
  // Handle API errors
  console.error('Blog creation failed:', error.message)
}
```

### 2. **Loading States**

```typescript
const [loading, setLoading] = useState(false)

const handleCreate = async () => {
  setLoading(true)
  try {
    await createBlogApi(data)
  } finally {
    setLoading(false)
  }
}
```

### 3. **Validation**

```typescript
// Client-side validation before API calls
const isValidSlug = await validateBlogSlugApi(slug)
if (!isValidSlug.data.isUnique) {
  // Handle duplicate slug
}
```

## 📈 Performance Considerations

1. **Pagination**: Always use pagination for large datasets
2. **Filtering**: Apply filters on the server side
3. **Caching**: Implement appropriate caching strategies
4. **Lazy Loading**: Load data as needed
5. **Bulk Operations**: Use bulk APIs for multiple operations

## 🔮 Future Enhancements

- [ ] Real-time updates with WebSocket
- [ ] GraphQL API integration
- [ ] Advanced search with Elasticsearch
- [ ] Multi-language content support
- [ ] Version control for content
- [ ] Advanced analytics and reporting

---

_This API documentation is automatically generated and maintained. For questions or contributions, please refer to the development team._
