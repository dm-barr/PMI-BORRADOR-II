import qrcode
from PIL import Image, ImageDraw

# URL
url = "https://congresotrujillo2025.pminorteperu.org/redirect.html"

# Crear QR
qr = qrcode.QRCode(
    version=4,  # puedes aumentar a 5 o 6 si quieres más detalle
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=1,  # lo ajustaremos manualmente para HD
    border=4,
)
qr.add_data(url)
qr.make(fit=True)

# Obtener matriz del QR
qr_matrix = qr.get_matrix()
qr_size = len(qr_matrix)

# Configuración HD
box_size = 200  # tamaño de cada módulo en pixeles (HD)
img_size = qr_size * box_size

# Crear imagen en blanco
img_qr = Image.new("RGB", (img_size, img_size), "white")
draw = ImageDraw.Draw(img_qr)

# Dibujar módulos como círculos
radius = box_size // 2
for y in range(qr_size):
    for x in range(qr_size):
        if qr_matrix[y][x]:
            x0 = x * box_size
            y0 = y * box_size
            x1 = x0 + box_size
            y1 = y0 + box_size
            draw.ellipse([x0, y0, x1, y1], fill="black")

# Logo centrado
logo = Image.open("logoqr.png").convert("RGBA")
logo_size = int(img_size * 0.25)  # 25% del tamaño del QR
logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)

# Fondo blanco redondeado para el logo
padding = int(logo_size * 0.05)
bg_size = logo_size + 2*padding
background = Image.new("RGBA", (bg_size, bg_size), (255, 255, 255, 255))
draw_bg = ImageDraw.Draw(background)
draw_bg.rounded_rectangle([(0, 0), (bg_size, bg_size)], radius=bg_size//6, fill=(255,255,255,255))
background.paste(logo, (padding, padding), logo)

# Pegar logo en QR
pos = ((img_size - bg_size)//2, (img_size - bg_size)//2)
img_qr.paste(background, pos, background)

# Guardar en HD
img_qr.save("qr1.png", dpi=(300,300))
print("QR negro estético en HD con módulos redondeados generado.")
