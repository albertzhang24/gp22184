half2 coords  : WPOS,   // grid coordinates
                
out half4 div : COLOR  // divergence
                
uniform half halfrdx   // 0.5 / gridscale
                
uniform samplerRECT w  // vector field

void main() {
   half4 wL = h4texRECT(w, coords - half2(1, 0));
   half4 wR = h4texRECT(w, coords + half2(1, 0));
   half4 wB = h4texRECT(w, coords - half2(0, 1));
   half4 wT = h4texRECT(w, coords + half2(0, 1));
 
   div = halfrdx * ((wR.x - wL.x) + (wT.y - wB.y));
 }