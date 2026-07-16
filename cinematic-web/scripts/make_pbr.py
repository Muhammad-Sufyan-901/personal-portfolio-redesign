"""Derive PBR maps (albedo / normal / roughness) from a photo texture.
Usage: python3 make_pbr.py <input> <name> <outdir> [size]
"""
import cv2, numpy as np, sys, os

def make_maps(src, name, outdir, size=1024):
    img = cv2.imread(src, cv2.IMREAD_COLOR)
    if img is None:
        print('FAIL read', src); return
    h, w = img.shape[:2]
    s = min(h, w)
    img = img[(h-s)//2:(h+s)//2, (w-s)//2:(w+s)//2]
    img = cv2.resize(img, (size, size), interpolation=cv2.INTER_AREA)

    # --- albedo: de-light (remove large-scale shading), keep detail ---
    f = img.astype(np.float32)
    blur = cv2.GaussianBlur(f, (0, 0), size * 0.08)
    albedo = np.clip(f - blur + blur.mean(axis=(0, 1), keepdims=True), 0, 255).astype(np.uint8)
    cv2.imwrite(os.path.join(outdir, f'{name}-albedo.jpg'), albedo,
                [cv2.IMWRITE_JPEG_QUALITY, 92])

    # --- height from band-passed luminance ---
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255.0
    hi = g - cv2.GaussianBlur(g, (0, 0), size * 0.05)
    hgt = cv2.GaussianBlur(hi, (0, 0), 1.2)
    hgt = (hgt - hgt.min()) / (np.ptp(hgt) + 1e-6)

    # --- normal map (OpenGL convention, +Y up) ---
    STR = 2.4
    gx = cv2.Sobel(hgt, cv2.CV_32F, 1, 0, ksize=5)
    gy = cv2.Sobel(hgt, cv2.CV_32F, 0, 1, ksize=5)
    nx, ny = -gx * STR, gy * STR
    nz = np.ones_like(hgt)
    ln = np.sqrt(nx * nx + ny * ny + nz * nz)
    nrm = np.dstack([nx / ln * 0.5 + 0.5, ny / ln * 0.5 + 0.5, nz / ln * 0.5 + 0.5])
    cv2.imwrite(os.path.join(outdir, f'{name}-normal.jpg'),
                (nrm[:, :, ::-1] * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 95])

    # --- roughness: rough in grainy areas, glossier on smooth bright ice ---
    detail = cv2.GaussianBlur(np.abs(hi), (0, 0), 3.0)
    detail = (detail - detail.min()) / (np.ptp(detail) + 1e-6)
    lum = cv2.GaussianBlur(g, (0, 0), 4.0)
    rough = np.clip(0.35 + detail * 0.5 + (1.0 - lum) * 0.15, 0, 1)
    cv2.imwrite(os.path.join(outdir, f'{name}-rough.jpg'),
                (rough * 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 90])
    print('OK', name, '->', outdir)

if __name__ == '__main__':
    size = int(sys.argv[4]) if len(sys.argv) > 4 else 1024
    os.makedirs(sys.argv[3], exist_ok=True)
    make_maps(sys.argv[1], sys.argv[2], sys.argv[3], size)
