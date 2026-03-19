import React from 'react';
import { motion } from 'motion/react';

const ErrorPage = ({ 
  title = "Oops! Page Lost in Space", 
  message = "The page you are looking for doesn't exist or is still processing its download. Let's get you back to downloading some videos!",
  errorCode = "404"
}) => {
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#09090b',
      padding: '2rem',
      textAlign: 'center',
      color: '#fff',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorations */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100vw',
        height: '100vw',
        background: 'radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h1 style={{ 
          fontSize: 'clamp(8rem, 20vw, 15rem)', 
          margin: 0, 
          fontWeight: 800, 
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1
        }}>
          {errorCode}
        </h1>
        
        <h2 style={{ 
          fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', 
          marginTop: '-1rem',
          fontWeight: 700,
          color: '#fff'
        }}>
          {title}
        </h2>

        <p style={{ 
          color: '#A1A1AA', 
          maxWidth: '500px', 
          margin: '1.5rem auto 0',
          fontSize: '1.1rem',
          lineHeight: 1.6
        }}>
          {message}
        </p>

        <div style={{ marginTop: '2.5rem' }}>
          <a 
            href="/" 
            style={{
              padding: '0.85rem 2.5rem',
              background: 'linear-gradient(135deg, #f43f5e 0%, #dc2626 50%, #991b1b 100%)',
              borderRadius: '12px',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              transition: 'all 0.2s',
              boxShadow: '0 8px 32px rgba(220, 38, 38, 0.25)',
              display: 'inline-block'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.filter = 'brightness(1.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.filter = 'brightness(1)';
            }}
          >
            Take me Home
          </a>
        </div>
      </motion.div>

      {/* Grid Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.5
      }} />
    </div>
  );
};

export default ErrorPage;
