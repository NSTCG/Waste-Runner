#include "lib/Compatibility.frag"

#define FEATURE_TEXTURED
#define FEATURE_ALPHA
#define FEATURE_ALPHA_MASKED
#define FEATURE_VERTEX_COLORS

#ifdef TEXTURED
#define USE_TEXTURE_COORDS
#endif
#ifdef VERTEX_COLORS
#define USE_COLOR
#endif
#define USE_OBJECT_ID

#include "lib/Inputs.frag"

#ifdef TEXTURED
#include "lib/Textures.frag"
#endif

#include "lib/Materials.frag"

struct Material {
    lowp vec4 color;
#ifdef TEXTURED
    mediump uint flatTexture;
#endif
};

Material decodeMaterial(uint matIndex) {
    {{decoder}}
    return mat;
}

void main() {
#ifndef PRE_Z_PASS
#ifdef TEXTURED
    /* PRE_Z_PASS was not used, we need to alpha mask ourselves! */
    alphaMask(fragObjectId, fragTextureCoords);
#endif
#endif

    Material mat = decodeMaterial(fragObjectId);
    outColor =
        #ifdef VERTEX_COLORS
        fragColor +
        #endif
        #ifdef TEXTURED
        textureAtlas(mat.flatTexture, fragTextureCoords)*
        #endif
        mat.color;
}
