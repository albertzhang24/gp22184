precision mediump float;
uniform vec2 res;//The width and height of our screen
uniform sampler2D velocityField;//Our input texture
uniform sampler2D advectionField;
uniform float dissipation;

vec2 bilerp(sampler2D texture, vec2 p)
{
    // add 0.5 for center of pixel
    float s = p.x - (floor(p.x - 0.5) + 0.5);
    float t = p.y - (floor(p.y - 0.5) + 0.5);

    vec4 uv;
    uv.xy = (floor(p - 0.5) + 0.5) / res.xy;
    uv.zw= (floor(p - 0.5) + 1.5) / res.xy;

    vec2 u00 = texture2D(texture, uv.xy).xy;
    vec2 u10 = texture2D(texture, uv.zy).xy;

    vec2 u0 = mix(u00, u10, s);

    vec2 u01 = texture2D(texture, uv.xw).xy;
    vec2 u11 = texture2D(texture, uv.zw).xy;

    vec2 u1 =  mix(u01, u11, s);

    return mix(u0, u1, t);
}

void main() {
    vec2 pixel = gl_FragCoord.xy / res.xy;
    vec2 p = gl_FragCoord.xy - texture2D(velocityField, pixel).xy;
    gl_FragColor = vec4(dissipation * bilerp(advectionField, p), 0.0, 1.0);
}
