export interface DetectionAttributes {

    faceId: string;
    recognitionModel?: string;
    faceRectangle?: FaceRectangle;
    faceLandmarks?: FaceLandmarks;
    faceAttributes?: FaceAttributes;
}

export interface FaceRectangle {

    width?: number;
    heigth?: number;
    left?: number;
    top?: number;
}

export interface FaceAttributes {

    age?: number;
    gender?: string;
    smile?: number;
    facialHair?: FacialHairAttributes;
    glasses?: string;
    headPose?: HeadPoseAttributes;
    emotion?: EmotionAttributes;
    hair?: HairAttributes;
    makeup?: MakeupAttributes;
    occlusion?: OcclusionAttributes;
    accessories: AccessoriesAttributes[];
    blur?: BlurAttributes;
    exposure?: ExposureAttributes;
    noise?: NoiseAttributes;
}

export interface FaceLandmarks {

    pupilLeft: Landmark;
    pupilRight: Landmark;
    noseTip: Landmark;
    mouthLeft: Landmark;
    mouthRight: Landmark;
    eyebrowLeftOuter: Landmark;
    eyebrowLeftInner: Landmark;
    eyeLeftOuter: Landmark;
    eyeLeftTop: Landmark;
    eyeLeftBottom: Landmark;
    eyeLeftInner: Landmark;
    eyebrowRightInner: Landmark;
    eyebrowRightOuter: Landmark;
    eyeRightInner: Landmark;
    eyeRightTop: Landmark;
    eyeRightBottom: Landmark;
    eyeRightOuter: Landmark;
    noseRootLeft: Landmark;
    noseRootRight: Landmark;
    noseLeftAlarTop: Landmark;
    noseRightAlarTop: Landmark;
    noseLeftAlarOutTip: Landmark;
    noseRightAlarOutTip: Landmark;
    upperLipTop: Landmark;
    upperLipBottom: Landmark;
    underLipTop: Landmark;
    underLipBottom: Landmark;
}


interface FacialHairAttributes {

    moustache?: number;
    beard?: number;
    sideburns?: number;
}

interface HeadPoseAttributes {

    roll?: number;
    yaw?: number;
    pitch?: number;
}

interface EmotionAttributes {

    anger?: number;
    contempt?: number;
    disgust?: number;
    fear?: number;
    happiness?: number;
    neutral?: number;
    sadness?: number;
    surprise?: number;
}

interface HairAttributes {

    bald?: number;
    invisible?: boolean;
    hairColor?: HairColorAttributes[];
}

interface HairColorAttributes {

    color?: string;
    confidence?: number;
}

interface MakeupAttributes {

    eyeMakeup?: boolean;
    lipMakeup?: boolean;
}

interface OcclusionAttributes {

    foreheadOccluded: boolean;
    eyeOccluded?: boolean;
    mouthOccluded?: boolean;
}

interface AccessoriesAttributes {

    type?: string;
    confidence?: number;
}

interface BlurAttributes {

    blurLevel?: string;
    value?: number;
}

interface ExposureAttributes {

    exposureLevel?: string;
    value?: number;
}

interface NoiseAttributes {

    noiseLevel?: string;
    value?: number;
}

interface Landmark {

    x: number;
    y: number;
}