# 🔧 CORS Error - Solutions

## ❌ Problem

You're getting a CORS error:
```
Access to fetch at 'http://localhost:8080/api/eventos/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present.
```

## ✅ Solution Implemented: Vite Proxy (Frontend)

I've configured a **Vite development proxy** that forwards all `/api/*` requests to your backend. This avoids CORS issues entirely during development.

### What Changed:

1. **`vite.config.ts`** - Added proxy configuration
2. **`src/services/api.ts`** - Changed to use relative URLs in development
3. **`.env`** - Updated to use empty string (proxy handles routing)

### How It Works:

```
Browser → http://localhost:5173/api/eventos/... 
         ↓ (Vite proxy)
Backend ← http://localhost:8080/api/eventos/...
```

The browser thinks it's calling the same origin, so no CORS error!

## 🚀 Next Steps

### 1. Restart Your Dev Server

**IMPORTANT:** You must restart Vite for the proxy to work:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 2. Test the Application

Open `http://localhost:5173` and the CORS error should be gone!

---

## 🔧 Alternative Solution: Fix Backend CORS (Recommended for Production)

If you need to fix CORS on the backend (Spring Boot), add this configuration:

### Option 1: Global CORS Configuration

Create a file `WebConfig.java` in your Spring Boot project:

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### Option 2: Controller-Level CORS

Add `@CrossOrigin` annotation to your controllers:

```java
@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "http://localhost:5173")
public class EventoSismicoController {
    // Your controller methods...
}
```

### Option 3: application.properties

Add to `application.properties`:

```properties
# CORS Configuration (Development only)
spring.web.cors.allowed-origins=http://localhost:5173
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true
```

---

## 📊 When to Use Each Solution

| Solution | When to Use | Pros | Cons |
|----------|-------------|------|------|
| **Vite Proxy** | Development only | ✅ No backend changes needed<br>✅ Quick setup | ❌ Doesn't work in production build |
| **Backend CORS** | Production | ✅ Works in all environments<br>✅ Proper solution | ⚠️ Requires backend access |

---

## 🎯 Current Setup (After Changes)

### Development Mode
- Frontend: `http://localhost:5173`
- API calls: `http://localhost:5173/api/...` (proxied to backend)
- Backend: `http://localhost:8080/api/...`
- **No CORS issues!** ✅

### Production Build
- Set `VITE_API_BASE_URL=https://your-api-domain.com` in `.env`
- Backend must have CORS configured
- API calls: Full URL to production backend

---

## ⚠️ Important Notes

1. **Restart Required**: After changing `vite.config.ts`, you MUST restart the dev server
2. **Development Only**: The proxy only works in development (`npm run dev`)
3. **Production**: For production builds, configure CORS on the backend
4. **`.env` Changes**: Empty `VITE_API_BASE_URL` is correct for development with proxy

---

## 🧪 Testing

After restarting the dev server, you should see:

```bash
# In browser console (no CORS errors)
✓ GET http://localhost:5173/api/eventos/eventos-sin-revision 200 OK

# In terminal (Vite proxy logs)
[vite] http proxy: /api/eventos/eventos-sin-revision -> http://localhost:8080
```

---

## 🆘 Still Having Issues?

### 1. Verify Backend is Running
```bash
curl http://localhost:8080/api/eventos/eventos-sin-revision
```

### 2. Check Vite Config
Make sure `vite.config.ts` has the proxy configuration.

### 3. Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or open in incognito mode

### 4. Check Console
Look for successful proxy requests in the Vite terminal output.

---

**✅ SOLUTION IMPLEMENTED: Just restart your dev server and the CORS error will be fixed!**

```bash
# Press Ctrl+C to stop
npm run dev
```
