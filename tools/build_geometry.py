"""Rebuilds web/src/data/{yevali,shivare}.json from the supplied layout PDFs.

Run from D:/SaiKrupaProperties:  python tools/build_geometry.py
Geometry is read from the vector paths in the PDFs, rotated upright (as the
sheets are meant to be read), scaled to metres and centred on the site.
Every Yevali plot area is checked against the area printed on the sheet.
"""
import fitz, math, json
from shapely.geometry import LineString
from shapely.ops import unary_union, polygonize

W = 2384  # sheet width in pt; upright frame is X = y_pdf, Y = W - x_pdf
def up(x, y): return (y, W - x)

def bez(p0, p1, p2, p3, n=6):
    out = []
    for i in range(n + 1):
        t = i / n; m = 1 - t
        out.append((m**3*p0.x+3*m*m*t*p1.x+3*m*t*t*p2.x+t**3*p3.x,
                    m**3*p0.y+3*m*m*t*p1.y+3*m*t*t*p2.y+t**3*p3.y))
    return out

def ext(l, e=5):
    c = list(l.coords)
    if len(c) > 2: return l
    (x1, y1), (x2, y2) = c[0], c[-1]
    d = math.dist((x1, y1), (x2, y2))
    if d < 1e-6: return l
    ux, uy = (x2-x1)/d, (y2-y1)/d
    return LineString([(x1-ux*e, y1-uy*e), (x2+ux*e, y2+uy*e)])

def shoelace(pts):
    n = len(pts)
    return abs(sum(pts[i][0]*pts[(i+1) % n][1]-pts[(i+1) % n][0]*pts[i][1] for i in range(n)))/2

SQFT_PER_SQM = 10.7639104

def yevali(pdf):
    d = fitz.open(pdf); p = d[0]
    lines = []
    for x in p.get_drawings():
        col = x.get("color")
        if col is None: continue
        c = tuple(round(v, 2) for v in col)
        if c not in [(0, 0, 0), (1, 0, 0)]: continue
        for it in x["items"]:
            if it[0] == "l":
                a, b = it[1], it[2]
                if math.dist((a.x, a.y), (b.x, b.y)) >= 3:
                    lines.append(LineString([(a.x, a.y), (b.x, b.y)]))
            elif it[0] == "c":
                lines.append(LineString(bez(*it[1:5])))
    sel = [l for l in lines if l.bounds[2] < 2340]
    polys = list(polygonize(unary_union([ext(l) for l in sel])))
    f0 = 0.16975
    faces = [pg for pg in polys if 2500 < pg.area*f0*f0*SQFT_PER_SQM < 150000]
    # face index (order of discovery) -> plot number, read off the numbered sheet
    face_to_plot = {12:1,13:3,14:4,15:5,16:6,10:7,11:8,9:9,21:10,23:11,25:12,27:13,29:14,
                    31:15,33:16,32:18,30:19,28:20,26:21,24:22,22:23,20:24,18:25,19:26,8:27,
                    7:28,6:29,5:30,3:31,4:32,2:33}
    printed = {**{n: 20000 for n in (1, 2, 3, 4, 5, 6, 7, 27, 28)},
               **{n: 11000 for n in (9, 10, 11, 12, 13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 26, 29, 30, 33)},
               8: 16700, 16: 15500, 17: 21700, 31: 15000, 32: 11850}
    plots = {}
    for fi, n in face_to_plot.items():
        plots[n] = [up(x, y) for x, y in list(faces[fi].exterior.coords)[:-1]]
    # plots 17 and 2 are merged into the road face by the polygoniser; their
    # corners are taken from the divider / road-edge lines of the same sheet
    # (already in upright pt coordinates).
    plots[17] = [(489, 753), (825, 747), (925, 852), (735, 1034), (480, 768)]
    plots[2] = [(1341, 627), (1185, 668), (1180, 686), (1482, 1002), (1596, 893)]
    amen = [up(x, y) for x, y in list(faces[1].exterior.coords)[:-1]]
    garden = [up(x, y) for x, y in list(faces[17].exterior.coords)[:-1]]
    num = sum(printed[n] for n in plots)
    den = sum(shoelace(plots[n]) for n in plots)
    s = math.sqrt(num / den / SQFT_PER_SQM)  # metres per pt
    print("Yevali scale m/pt", round(s, 5))
    rows = []
    worst = 0
    for n in sorted(plots):
        a = shoelace(plots[n]) * s * s * SQFT_PER_SQM
        err = (a - printed[n]) / printed[n] * 100
        worst = max(worst, abs(err))
        print(f"  plot {n:2d} printed {printed[n]:6d} traced {a:9.0f}  {err:+.2f}%")
        rows.append((n, printed[n], plots[n]))
    print("  worst deviation %.2f%%" % worst)
    assert worst < 2.5, "plot area mismatch"
    a_am = shoelace(amen) * s * s * SQFT_PER_SQM
    print("  amenity printed 13700 traced %.0f" % a_am)
    boundary = [(1704, 325), (1665, 334), (1544, 402), (1424, 479), (1316, 559), (1288, 649), (1270, 728),
                (1158, 761), (992, 807), (908, 837), (649, 771), (603, 965), (563, 1069), (515, 1149),
                (199, 1062), (58, 1036), (47, 1133), (43, 1244), (132, 1265), (350, 1257), (511, 1628),
                (593, 1812), (970, 2380), (1646, 1732), (1880, 1509), (1715, 894), (1708, 768)]
    boundary = [up(x, y) for x, y in boundary]
    river = [(1411, 179), (1806, 454), (2188, 608), (2421, 834), (2659, 1198), (2699, 1271),
             (3045, 1061), (2841, 664), (2520, 342), (2295, 236), (1985, 180), (1681, 62)]
    allpts = [pt for _, _, pl in rows for pt in pl] + amen + garden + river
    cx = (min(x for x, _ in allpts) + max(x for x, _ in allpts)) / 2
    cy = (min(y for _, y in allpts) + max(y for _, y in allpts)) / 2

    def T(pts): return [[round((x-cx)*s, 2), round((y-cy)*s, 2)] for x, y in pts]
    return {
        "slug": "yevali", "printedScale": "1:1000",
        "plots": [{"no": str(n), "areaSqft": a, "points": T(pl)} for n, a, pl in rows],
        "amenity": {"areaSqft": 13700, "points": T(amen)},
        "garden": T(garden), "river": T(river), "boundary": T(boundary),
        "labels": {"road30": T([(1017, 675)])[0],
                   "road20": T([(1074, 1447), (1374, 1400), (1590, 1145)])},
        "terrain": {"minM": 580.0, "maxM": 608.5},
    }


def shivare(pdf):
    d = fitz.open(pdf); p = d[0]
    segs = []
    for x in p.get_drawings():
        col = x.get("color")
        if x.get("fill") is None and col is not None and tuple(round(v, 2) for v in col) == (1, 1, 0):
            for it in x["items"]:
                if it[0] == "l":
                    segs.append(((it[1].x, it[1].y), (it[2].x, it[2].y)))
    ys = [(a, b) for a, b in segs if math.dist(a, b) >= 6 and a[1] < 3200 and a[0] > 700]
    polys = list(polygonize(unary_union([ext(LineString([a, b]), 6) for a, b in ys])))
    big = [pg for pg in polys if 2000 < pg.area < 120000]

    def face_near(X, Y):
        best = None
        for pg in big:
            c = pg.centroid
            dd = math.dist(up(c.x, c.y), (X, Y))
            if best is None or dd < best[0]: best = (dd, pg)
        assert best[0] < 60, (X, Y, best[0])
        return [up(x, y) for x, y in list(best[1].exterior.coords)[:-1]]

    ox, oy, sc = 1650, 200, 0.9
    px = lambda a, b: (a/sc+ox, b/sc+oy)
    plots = {
        "12A": face_near(2972, 397), "10": face_near(2910, 631), "8": face_near(2836, 813),
        "6": face_near(2717, 981), "4": face_near(2578, 1171), "2": face_near(2418, 1410),
        "3": face_near(2189, 1022), "7": face_near(2387, 640), "9": face_near(2471, 491),
        "11": face_near(2554, 341),
        "1": [px(290, 805), px(553, 908), px(428, 1140), px(165, 1037)],
        "5": [px(490, 415), px(770, 512), px(680, 676), px(418, 570)],
        "12": [(2443, 206), (2747, 325), (2808, 182), (2500, 100)],
    }
    stated_are = {"1": 25.0, "2": 25.0, "3": 25.0, "4": 25.0, "5": 17.0, "6": 22.0, "7": 15.0, "8": 25.0,
                  "9": 15.0, "10": 22.0, "11": 15.0, "12": 12.40, "12A": 24.70}
    s = 12.192 / 78.7  # 40 ft spine road = 12.192 m, measured 78.7 pt across
    print("Shivare scale m/pt", round(s, 5))
    order = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "12A"]
    rows = []
    ratios = []
    for n in order:
        a_sqm = shoelace(plots[n]) * s * s
        ratios.append(a_sqm / (stated_are[n] * 100))
        rows.append((n, stated_are[n], a_sqm, plots[n]))
        print(f"  plot {n:>3} stated {stated_are[n]:5.2f} are  traced {a_sqm/100:6.2f} are  ratio {ratios[-1]:.3f}")
    print("  traced/stated ratio %.3f..%.3f" % (min(ratios), max(ratios)))
    spine = [(2125, 1467), (2808, 182), (2901, 206), (2200, 1494)]
    access = [(2162, 1480), (1933, 1439), (1788, 1387), (1658, 1340), (1502, 1290), (1368, 1242),
              (1262, 1250), (1181, 1393), (1125, 1501), (1053, 1639), (933, 1716), (774, 1793), (621, 1821)]
    allpts = [pt for _, _, _, pl in rows for pt in pl] + access
    cx = (min(x for x, _ in allpts) + max(x for x, _ in allpts)) / 2
    cy = (min(y for _, y in allpts) + max(y for _, y in allpts)) / 2

    def T(pts): return [[round((x-cx)*s, 2), round((y-cy)*s, 2)] for x, y in pts]
    return {"slug": "shivare",
            "plots": [{"no": n, "statedAre": st, "tracedSqft": round(a*SQFT_PER_SQM), "points": T(pl)}
                      for n, st, a, pl in rows],
            "spine": T(spine), "access": T(access), "roadWidthM": 12.192}


if __name__ == "__main__":
    base = "D:/SaiKrupaProperties/"
    y = yevali(base + "YEWALI G NO 312 LAYOUT.pdf")
    json.dump(y, open(base + "web/src/data/yevali.json", "w"), separators=(",", ":"))
    sh = shivare(base + "SHIVRE G NO 148 149 151 Google.pdf")
    json.dump(sh, open(base + "web/src/data/shivare.json", "w"), separators=(",", ":"))
    print("written")
