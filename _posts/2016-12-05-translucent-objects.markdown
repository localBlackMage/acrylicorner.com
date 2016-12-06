---
layout: post
comments: true
title: "Unreal 4: How to See Through Walls"
date:   2016-12-05 00:00:00 -0500
categories: programming Unreal4
---
I'm currently using Unreal 4.12. I do not know how far back this solution will work, but it should work in newer versions!

The Problem
-------------------------------------
You have a player character navigating your landscape with a third person camera view. Seems fine and good until 
your player character goes behind a wall or a piece of the environment that blocks the camera's view of the character! 
So how do you handle it? If you're using a Spring Arm component, you can set *Camera Collision -> Do Collision Test*. This
will automatically bring the camera up to the player should they go behind a wall, however... which may not be the desired effect.

Games like Diablo 2, which have an isometric view of things from roughly 45 degrees in the air and far away from your character,
would be strange to play with the camera zooming in and out on the player like that should a wall or stray pillar cross
the view path. The solution? Make the obstructing object see through!

![Diablo 2 Hidden Wall 1](../../../../../../images/2016_12_05/maxresdefault_1.jpg)
![Diablo 2 Hidden Wall 2](../../../../../../images/2016_12_05/maxresdefault_2.jpg)

As you can see in the shots above, the walls that would normally obstruct the player from view are instead sort of faded
to a semi-transparent state. 

The more modern iteration, Diablo 3, does things a little differently. As soon as the player would go behind something that
would block their view, the object fades quickly from view. 

[Diablo 3 wall hiding in action](http://acrylicorner.com/videos/2016_12_05/Diablo_3_hideWalls.webm "Diablo 3 Wall Hiding")

So now we arrive at our question: how do we do that?

The Solution (or at least mine)
-------------------------------------
So the first thing you'll want to do is have a way of detecting what's possibly in the player's way. You can do this
through ray casting from the camera to the player. Theoretically you should be able to use a trigger volume as well 
with the same result, but as of my writing this, UE4 had some issues with trigger volumes firing overlap events incorrectly.

So we have our player:

**AHideWallsCharacter.h**
```cpp
#pragma once
#include "GameFramework/Character.h"
#include "HideableWall.h"
#include "HideWallsCharacter.generated.h"

UCLASS(Blueprintable)
class AHideWallsCharacter : public ACharacter
{
	GENERATED_BODY()
public:
	AHIdeWallsCharacter();
	// Called every frame.
	virtual void Tick(float DeltaSeconds) override;
	/** Returns TopDownCameraComponent subobject **/
	FORCEINLINE class UCameraComponent* GetTopDownCameraComponent() const { return TopDownCameraComponent; }
	{ code omitted for brevity }

private:
	/** Top down camera */
	UPROPERTY(VisibleAnywhere, BlueprintReadOnly, Category = Camera, meta = (AllowPrivateAccess = "true"))
	class UCameraComponent* TopDownCameraComponent;
	{ code omitted for brevity }
	// Array of AHideableWall objects that are currently blocking the player from sight
	TArray<AHideableWall*> BlockingWalls;
	// Our function to detect blocking objects
	virtual void DetectBlockingObjects();
};
```

The important things to note about the above code is the BlockingWalls TArray and DetectBlockingObjects function. The camera
component comes standard with the generated character, but will be needed for the ray casting. 

**AHideWallsCharacter.cpp**
```cpp
#include "HideWalls.h"
#include "HideWallsCharacter.h"
#include "Runtime/CoreUObject/Public/UObject/ConstructorHelpers.h"
#include "Runtime/Engine/Classes/Components/DecalComponent.h"
#include "Kismet/HeadMountedDisplayFunctionLibrary.h"

AHideWallsCharacter::AHideWallsCharacter()
{
	{ omitted for brevity }

	ObjectTypesToTraceFor = { ECC_WorldDynamic }; //{ EObjectTypeQuery::ObjectTypeQuery_MAX };
}

void AHideWallsCharacter::Tick(float DeltaSeconds)
{
    { omitted for brevity }

	DetectBlockingObjects();
}

void AHideWallsCharacter::DetectBlockingObjects() {
	// Start and end point of our ray, start at the camera, end at the player
	FVector start = TopDownCameraComponent->K2_GetComponentLocation();
	FVector end = this->GetActorLocation();
	// Captured FHitResult objects from our ray cast
	TArray<FHitResult> hits;
	// AHideableWall objects hit from our ray cast
	TArray<AHideableWall*> WallsHitThisPass;
	
	// Cast our ray!
	GetWorld()->LineTraceMultiByObjectType(hits, start, end, FCollisionObjectQueryParams(ECC_WorldDynamic));

    // Iterate over the FHitResult objects, if it is a blocking hit and it was a AHideablWall object, tell the wall to 
    // hide itself, then store a pointer to the hit object in WallsHitThisPass and BlockingWalls
	for(FHitResult hit: hits) {
		if (hit.bBlockingHit) {
			AHideableWall* wall = Cast<AHideableWall>(hit.Actor.Get());
			if (wall) {
				wall->HideWall();
				WallsHitThisPass.AddUnique(wall);
				BlockingWalls.AddUnique(wall);
			}
		}
	}

    // Iterate over the BlockingWalls that we've stored up to this point, if any are NOT in WallsHitThisPass, 
    // mark it for removal as well as tell the wall to show itself
	TArray<AHideableWall*> WallsToRemove;
	for (AHideableWall* wall: BlockingWalls) {
		if (!WallsHitThisPass.Contains(wall)) {
			wall->ShowWall();
			WallsToRemove.Add(wall);
		}
	}
	// Lastly, remove all walls from BlockingWalls that we previously marked for removal
	for (AHideableWall* wall : WallsToRemove) {
		BlockingWalls.Remove(wall);
	}
}
```

That's the basics of how the character does our wall detection and subsequently hides or shows the wall! 

This begs the question of how to actually hide and show the walls! For my demo I've defined the AHideableWall object, as
you've seen referenced in the code above. You can get as complex or as simple as you want with how you do it, the important
bit is that each blocking object that you want to hide must conform to some sort of Hide/Show functionality.

**HideableWall.h**
```cpp
#pragma once

#include "GameFramework/Actor.h"
#include "HideableWall.generated.h"

UCLASS()
class HIDEWALLS_API AHideableWall : public AActor
{
	GENERATED_BODY()
	
public:	
	// Sets default values for this actor's properties
	AHideableWall();

	UPROPERTY(BlueprintReadOnly, Category = Display)
		bool ShouldHide;
	UPROPERTY(BlueprintReadOnly, Category = Display)
		bool ShouldShow;
	UPROPERTY(EditAnywhere, Category = Display)
		float FinalFadeAmount;
	UPROPERTY(EditAnywhere, Category = Display)
		float CurrentFade;
	UPROPERTY(EditAnywhere, Category = Display)
		float FadeRate;
	UPROPERTY(EditAnywhere, Category = Material)
		UMaterial* translucentMaterial;
	UPROPERTY(EditAnywhere, Category = Material)
		UMaterial* opaqueMaterial;

	/** Returns TopDownCameraComponent subobject **/
	FORCEINLINE class UStaticMeshComponent* GetWallMeshComponent() const { return WallMeshComponent; }

	// Called when the game starts or when spawned
	virtual void BeginPlay() override;
	
	// Called every frame
	virtual void Tick( float DeltaSeconds ) override;

	virtual void HideWall();

	virtual void ShowWall();
	
private:
	/** Wall Mesh */
	UPROPERTY(EditAnywhere, Category = Mesh, meta = (AllowPrivateAccess = "true"))
	class UStaticMeshComponent* WallMeshComponent;
	
	virtual void ChangeMeshMaterialToOpaque();

	virtual void ChangeMeshMaterialToTranslucent();
};
```

As the AHideableWall.cpp is a bit large, I'm going to break it up into chunks and explain it.

**AHideableWall.cpp**
```cpp
#include "HideWalls.h"
#include "Kismet/KismetMaterialLibrary.h"
#include "HideableWall.h"

// Sets default values
AHideableWall::AHideableWall() {
 	// Set this actor to call Tick() every frame.  You can turn this off to improve performance if you don't need it.
	PrimaryActorTick.bCanEverTick = true;

	UStaticMesh* meshToUse = Cast<UStaticMesh>(StaticLoadObject(UStaticMesh::StaticClass(), NULL, TEXT("/Game/Geometry/Meshes/1M_Cube_Chamfer.1M_Cube_Chamfer")));
	WallMeshComponent = CreateDefaultSubobject<UStaticMeshComponent>(TEXT("Wall Mesh Component"));
	if (meshToUse && WallMeshComponent) {
		WallMeshComponent->SetStaticMesh(meshToUse);
	}

	ShouldHide = false;
	ShouldShow = false;
	FinalFadeAmount = 0.2f; // Minimum Opacity
	CurrentFade = 1.0f;		// Maximum Opacity by default
	FadeRate = 10.0f;		// Rate at which to fade between max and min opacity

    // Load our translucent material 
	static ConstructorHelpers::FObjectFinder<UMaterial> t_Mat(TEXT("Material'/Game/Geometry/Meshes/CubeMaterial_Translucent.CubeMaterial_Translucent'"));
	if (t_Mat.Object != NULL) {
		translucentMaterial = t_Mat.Object;
	}
	// Load our opaque material
	static ConstructorHelpers::FObjectFinder<UMaterial> o_Mat(TEXT("Material'/Game/Geometry/Meshes/CubeMaterial.CubeMaterial'"));
	if (o_Mat.Object != NULL) {
		opaqueMaterial = o_Mat.Object;
	}
}
```

Here I'm just initializing our Fade measures: desired maximum fade, defaulting our current fade to maximum opacity, and
setting the default rate to fade between fully opaque and the maximum fade amount. 

Below that is where we get into some of the trickery I had to perform in order to *use* fading! I have two different materials 
defined, a normal Opaque material and a duplicate Translucent material. UE4 Opaque materials do not support opacity and 
my artist colleague had generated their textures using the default opaque option. By creating the translucent material,
I have a mat that looks nearly the same (depends largely on lighting) and can support opacity. 

**Opaque Material**
![Opaque](../../../../../../images/2016_12_05/opaqueMat.jpg)

**Translucent Material**
![Opaque](../../../../../../images/2016_12_05/translucentMat.jpg)

If you know of a better way to do this, feel free to message me with suggestions! For now, I'll carry on with the example:


**AHideableWall.cpp Continued**
```cpp
// Called every frame
void AHideableWall::Tick( float DeltaTime ) {
	Super::Tick( DeltaTime );

    // If this wall should be hiding, decrement CurrentFade by our FadeRate
	if (ShouldHide) {
		CurrentFade -= DeltaTime * FadeRate;

        // If CurrentFade is less then our desired FinalFadeAmount, cap it off and tell this wall to stop hiding
		if (CurrentFade < FinalFadeAmount) {
			CurrentFade = FinalFadeAmount;
			ShouldHide = false;
		}
		// Set the translucent material's Opacity property to CurrentFade
		WallMeshComponent->CreateAndSetMaterialInstanceDynamic(0)->SetScalarParameterValue(TEXT("Opacity"), CurrentFade);
	}
	// If this wall should be showing, increment CurrentFade by our FadeRate
	else if (ShouldShow) {
		CurrentFade += DeltaTime * FadeRate;

        // If CurrentFade is more then 1.0 (maximum opacity), cap it off and tell this wall to stop showing
        // If you're using an opaque material for normal display purposes, change the material back now
		if (CurrentFade > 1.0f) {
			CurrentFade = 1.0f;
			ShouldShow = false;
			ChangeMeshMaterialToOpaque();
		}
		// Set the translucent material's Opacity property to CurrentFade
		WallMeshComponent->CreateAndSetMaterialInstanceDynamic(0)->SetScalarParameterValue(TEXT("Opacity"), CurrentFade);
	}
}
```
Here's where the bulk of the work goes on. Basically, we either increment or decrement CurrentFade if this wall is
supposed to be showing/hiding respectively. The updated CurrentFade amount becomes the Opacity amount we set on the 
translucent material.

**AHideableWall.cpp**
```cpp
// Set the material of the wall component to the opaque material, if loaded
void AHideableWall::ChangeMeshMaterialToOpaque() {
	if (opaqueMaterial) {
		UMaterialInstanceDynamic* opaqueMaterial_Dynamic = UKismetMaterialLibrary::CreateDynamicMaterialInstance(this, opaqueMaterial);
		WallMeshComponent->SetMaterial(0, opaqueMaterial_Dynamic);
	}
}

// Set the material of the wall component to the translucent material and set it's Opacity to the current fade amount, if loaded
void AHideableWall::ChangeMeshMaterialToTranslucent() {
	if (translucentMaterial) {
		UMaterialInstanceDynamic* translucentMaterial_Dynamic = UKismetMaterialLibrary::CreateDynamicMaterialInstance(this, translucentMaterial);
		translucentMaterial_Dynamic->SetScalarParameterValue(TEXT("Opacity"), CurrentFade);
		WallMeshComponent->SetMaterial(0, translucentMaterial_Dynamic);
	}
}

// Public function for the player to call, switches ShouldHide and ShouldShow if this wall is not already in the
// process of hiding and will call to swap the material to translucent
void AHideableWall::HideWall() {
	if (!ShouldHide) {
		ShouldShow = false;
		ShouldHide = true;
		ChangeMeshMaterialToTranslucent();
	}
}

// Public function for the player to call, switches ShouldHide and ShouldShow if this wall is not already in the
// process of showing
void AHideableWall::ShowWall() {
	if (!ShouldShow) {
		ShouldShow = true;
		ShouldHide = false;
	}
}
```

That's all there is to the C++ of it! I'm sure there are ways to optimize this and I'd love to hear any feedback or 
suggestions anyone might have on how to do so, but I wanted to get my process down for others to see and maybe even learn from!

[The end result ends up something like this!](http://acrylicorner.com/videos/2016_12_05/hideWallsDemo.webm "Hideable Walls Demo")

Pardon the shoddy camera work, I was using the top down template for the demo. 

[The source code for this demo project can be found on my github, for anyone wanting to take a look!](https://github.com/hprofit/UE4_HideWalls)

See you around!

-Holden

{% if page.comments %}
<div id="disqus_thread"></div>
<script>
/**
* RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
* LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
*/
/*
var disqus_config = function () {
this.page.url = PAGE_URL; // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
*/
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');

s.src = '//acrylicorner.disqus.com/embed.js';

s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
{% endif %}